import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuracao do Swagger
  const config = new DocumentBuilder()
    .setTitle('Clube do Romance API')
    .setDescription('API para o Clube do Romance do Vale, especialmente para quem é do vale!')
    .setVersion('1.0')
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
  SwaggerModule.setup('clube-do-romance', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
