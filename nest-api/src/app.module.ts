import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import * as path from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExportModule } from './export/export.module';

const isCompiled = __dirname.includes('dist'); // detecta se está rodando build
const envPath = isCompiled
  ? path.resolve(__dirname, '../.env') // caminho após build
  : path.resolve(__dirname, '../../.env'); // caminho durante ts-node

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    WeatherModule,
    UsersModule,
    AuthModule,
    ExportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
