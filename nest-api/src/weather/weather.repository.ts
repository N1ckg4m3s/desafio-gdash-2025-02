import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './create-weather.dto';
import { prisma } from 'src/db/dataBaseConnection';

type WeatherCreateInternal = Omit<CreateWeatherDto, 'time'> & {
  time: Date;
};

@Injectable()
export class WeatherRepository {
  async create(createWeatherDto: WeatherCreateInternal) {
    try {
      const weather = await prisma.weather.create({
        data: {
          time: createWeatherDto.time,
          temperature: createWeatherDto.temperature,
          windspeed: createWeatherDto.windspeed,
          windDirection: createWeatherDto.windDirection,
          isDay: createWeatherDto.isDay,
          weatherCode: createWeatherDto.weatherCode,
          humidity: createWeatherDto.humidity,
        },
      });

      return weather;
    } catch (e: any) {
      console.error('Erro ao adicionar informações do clima', e);
      return undefined;
    }
  }

  async findAll(params: { page: number; perPage: number; startPeriod?: Date; endPeriod?: Date }) {
    const { page, perPage, startPeriod, endPeriod } = params;
    const skip = (page - 1) * perPage;

    const where: any = {};
    if (startPeriod || endPeriod) {
      where.time = {};
      if (startPeriod) where.time.gte = startPeriod;
      if (endPeriod) where.time.lte = endPeriod;
    }


    try {
      const weather = await prisma.weather.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { time: 'desc' },
      });

      return weather;
    } catch (e: any) {
      console.error('Erro ao obter todas as informações do clima', e);
      throw e;
    }
  }

  async count(params: { startPeriod?: Date; endPeriod?: Date }) {
    const { startPeriod, endPeriod } = params;

    const where: any = {};
    if (startPeriod || endPeriod) {
      where.time = {};
      if (startPeriod) where.time.lte = startPeriod.toISOString();
      if (endPeriod) where.time.gte = endPeriod.toISOString();
    }

    const contagem = prisma.weather.count({ where })

    return contagem
  }
}
