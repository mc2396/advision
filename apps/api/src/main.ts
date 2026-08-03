import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // rimuove campi non previsti dal DTO
      forbidNonWhitelisted: true, // errore se arrivano campi extra
      transform: true, // converte i payload nei tipi dei DTO
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AdVision API')
    .setDescription('API per l\'analisi e la gestione delle campagne Meta Ads')
    .setVersion('1.0')
    .addTag('campaigns')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
