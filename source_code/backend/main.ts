import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();

    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`API chạy tại http://localhost:${port}`);
}
bootstrap();
