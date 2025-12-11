import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { GoogleBooksApiService } from './client/googleBooksApi.service';
import { BooksMapper } from './mapper/books.mapper';
import { GoogleBooksApiMapper } from './client/googleBooksApi.mapper';
import { UtilsModule } from 'src/utils/utils.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksEntity } from './entities/books.entity';
import { BOOKS_REPOSITORY_INTERFACE } from './interfaces/repository/iBooksRepository.interface';
import { BooksRepository } from './repositories/books.repository';

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    GoogleBooksApiService,
    BooksMapper,
    GoogleBooksApiMapper,
    {
      provide: BOOKS_REPOSITORY_INTERFACE,
      useClass: BooksRepository,
    },
  ],
  exports: [
    BooksService,
    GoogleBooksApiService,
    BooksMapper,
    GoogleBooksApiMapper,
  ],
  imports: [UtilsModule, HttpModule, TypeOrmModule.forFeature([BooksEntity])],
})
export class BooksModule {}
