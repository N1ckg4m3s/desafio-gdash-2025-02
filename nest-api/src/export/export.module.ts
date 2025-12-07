import { forwardRef, Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { WeatherModule } from 'src/weather/weather.module';
import { GuardModule } from 'src/guard/guard.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    WeatherModule,
    forwardRef(() => GuardModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [ExportController],
  providers: [ExportService]
})
export class ExportModule { }
