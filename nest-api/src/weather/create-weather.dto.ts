import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateWeatherDto {
    @IsString()
    time: string;

    @IsNumber()
    temperature: number;

    @IsNumber()
    windspeed: number;

    @IsNumber()
    windDirection: number;

    @IsBoolean()
    isDay: boolean;

    @IsNumber()
    weatherCode: number;

    @IsNumber()
    humidity: number;
}
