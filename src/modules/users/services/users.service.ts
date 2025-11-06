import { ConflictException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';
import { UsersModel } from '../model/users.model';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersResponseDto } from '../dto/createUsersResponse.dto';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { Metadata } from '../../../utils/metaData';
import { RandomCodesActivation } from '../../../utils/randomCodesActivation';
import { ActiveUsersModel } from '../model/activeUsers.model';
import { ActiveUsersMapper } from '../mapper/activeUsers.mapper';


@Injectable()
export class UsersService {

  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    private readonly passwordHasher: PasswordHasherd
  ) {}

  async create(userModel: UsersModel): Promise<CreateUsersResponseDto> {

    const userExist: UsersEntity | null = await this.usersRepository.findByEmailOrDisplayName(userModel.displayName, userModel.email);
    
    if(userExist){
      Logger.warn(`${HttpStatus.CONFLICT} - (${userModel.email} - ${userExist.email}) or (${userModel.displayName} - ${userExist.displayName}) are equal.`, Metadata.create({serviceMethod: 'UsersService.create'}));
      throw new ConflictException('User with given email or display name already exists.')
    }

    const hashPassword = await this.passwordHasher.hash(userModel.password);

    const userNewModel = new UsersModel(
      userModel.displayName,
      userModel.email,
      hashPassword,
      userModel.role
    );
    
    const user: UsersEntity = CreateUsersMapper.toEntity(userNewModel);
    const createdUser: UsersEntity = await this.usersRepository.create(user);
    
    return CreateUsersMapper.toResponse(createdUser);
  }

  async activeAccount(id: string, codActive: string) {

    const userExist: UsersEntity | null = await this.usersRepository.findById(id);

    if(!userExist){
      Logger.warn(`${HttpStatus.NOT_FOUND} - User with id ${id} not found.`, Metadata.create({serviceMethod: 'UsersService.activeAccount'}));
      throw new NotFoundException('User not found.')
    }

    if(userExist.isActive){
      Logger.warn(`${HttpStatus.CONFLICT} - User with id ${id} is already activated - status: ${userExist.isActive}`, Metadata.create({serviceMethod: 'UsersService.activeAccount'}));
      throw new ConflictException('User is already activated.')
    }

    const generateCodeActivation = await RandomCodesActivation.generate();

    const activationCodeToModel = new ActiveUsersModel(id, generateCodeActivation);
    const activateEntity = ActiveUsersMapper.toEntity(activationCodeToModel);

    //TODO: SALVAR NO BANCO O CÓDIGO DE ATIVAÇÃO
    //TODO: ENVIAR EMAIL DE CODIGO DE ATIVACAO - CRIAR UM SERVICO PRA ISSO
    //TODO: VERIFICAR SE O CODIGO ENVIADO É IGUAL AO GERADO E ATIVAR A CONTA - LIMITE VERIFICACAO 3 VEZES OU 30 MIN
      //TODO: SE NAO VERIFICADO CORRETAMENTE OU A TEMPO DELETAR O CODIGO DA TABELA;
        //USUARIO CONTINUAR DESATIVADO
    //TODO: CRIAR UM METODO PARA DELETAR O CODIGO APÓS A ATIVAÇÃO

    return HttpStatus.OK;
  }
}
