import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config(); // Load biến môi trường từ .env nếu có

    const app = await NestFactory.create(AppModule);

    // Bật global validation (tự động validate DTO)
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(` http://localhost:${port}`);
}
bootstrap();
