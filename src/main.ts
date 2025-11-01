import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './error/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//Validacao de erros - parametros
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => {
    const resultErrors = errors.map(er => ({
      property: er.property,
      errorMessage: Object.values(er.constraints || {}).join(', '),
    }));
    return new BadRequestException({
      message: 'Validation error',
      errors: resultErrors 
    });
  },
}));

  // Configuracao de Excessao Global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuracao do Swagger
  const config = new DocumentBuilder()
    .setTitle('Clube do Romance API')
    .setDescription('API para o Clube do Romance do Vale, especialmente para quem é do vale!')
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal Server Error',
    })
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Insira o token JWT no formato Bearer <token>',
    },
    'access-token'
  ).build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs/clube-livro', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
