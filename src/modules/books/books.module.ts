import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { GoogleBooksApiService } from './client/googleBooksApi.service';
import { BooksMapper } from './mapper/books.mapper';
import { GoogleBooksApiMapper } from './client/googleBooksApi.mapper';
import { UtilsModule } from 'src/utils/utils.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BooksController],
  providers: [ BooksService, GoogleBooksApiService, BooksMapper, GoogleBooksApiMapper],
  exports: [BooksService, GoogleBooksApiService, BooksMapper, GoogleBooksApiMapper],
  imports: [UtilsModule,HttpModule],
})
export class BooksModule {}
