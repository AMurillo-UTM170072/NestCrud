import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './config/constans';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const configservice=app.get(ConfigService);
  //server port 3000
  const port=+configservice.get<number>(SERVER_PORT) || 3000
  await app.listen(port);
  console.log('todo charcha bien');
}
bootstrap();
