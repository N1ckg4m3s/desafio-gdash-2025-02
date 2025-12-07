import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherRepository } from './weather.repository';
import { GuardModule } from 'src/guard/guard.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => GuardModule), forwardRef(() => AuthModule)],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherRepository],
  exports: [WeatherService, WeatherRepository]
})
export class WeatherModule { }
