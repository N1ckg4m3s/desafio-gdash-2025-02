import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeatherDto } from './create-weather.dto';
import { WeatherRepository } from './weather.repository';
import { WeatherInsight } from 'src/types/types';

@Injectable()
export class WeatherService {
  constructor(private readonly WeatherRepository: WeatherRepository) { }

  async generateInsights(): Promise<WeatherInsight> {
    const { history, total } = await this.findAllOfToday();

    if (!history.length) {
      return {
        summary: 'Sem dados disponíveis',
        alerts: [],
        classification: 'N/A',
        stats: {
          tempMin: 0,
          tempMax: 0,
          tempAvg: 0,
          windMax: 0,
          humidityMin: 0,
          humidityMax: 0,
          humidityAvg: 0
        },
      };
    }

    const temps = history.map(d => d.temperature);
    const winds = history.map(d => d.windspeed);
    const humidities = history.map(d => d.humidity ?? 0);

    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);
    const tempAvg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);

    const windMax = Math.max(...winds);

    const humidityMin = Math.min(...humidities);
    const humidityMax = Math.max(...humidities);
    const humidityAvg = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);

    // classificação do dia
    let classification = 'Clima agradável';
    if (tempMax > 35) classification = 'Calor extremo';
    else if (tempMin < 10) classification = 'Frio intenso';
    else if (history.some(d => d.weatherCode >= 60)) classification = 'Dia chuvoso';

    // alertas
    const alerts: string[] = [];
    if (tempMax > 35) alerts.push('Calor extremo');
    if (tempMin < 10) alerts.push('Frio intenso');
    if (windMax > 20) alerts.push('Vento forte');
    if (history.some(d => d.weatherCode >= 60)) alerts.push('Alta chance de chuva');

    // resumo textual
    const summary = `Nos últimos ${history.length} registros, a temperatura média foi ${tempAvg}°C, mínima ${tempMin}°C, máxima ${tempMax}°C. Umidade média: ${humidityAvg}%. ${alerts.join(', ')}`;

    return {
      summary,
      alerts,
      classification,
      stats: {
        tempMin,
        tempMax,
        tempAvg,
        windMax,
        humidityMin,
        humidityMax,
        humidityAvg
      },
    };
  }

  async create(createWeatherDto: CreateWeatherDto) {
    const response = await this.WeatherRepository.create({
      ...createWeatherDto,
      time: new Date(createWeatherDto.time)
    })

    if (!response) {
      throw new BadRequestException('Erro ao salvar dados do clima');
    }

    return response;
  }

  async findAll(params: { page?: number; perPage?: number } = {}) {
    const { page = 1, perPage = 10 } = params;

    const history = await this.WeatherRepository.findAll({ page, perPage })
    const total = await this.WeatherRepository.count({})

    return {
      total: total ?? 0,
      history: history ?? []
    };
  }

  async findAllOfToday(params: { page?: number; perPage?: number } = {}) {
    const { page = 1, perPage = 10 } = params;

    const now = new Date();

    const startOfDayUTC = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    ));

    // fim do dia UTC
    const endOfDayUTC = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    ));

    const history = await this.WeatherRepository.findAll({
      page,
      perPage,
      startPeriod: startOfDayUTC,
      endPeriod: endOfDayUTC,
    })

    const total = await this.WeatherRepository.count({
      startPeriod: startOfDayUTC,
      endPeriod: endOfDayUTC,
    })

    return {
      total: total ?? 0,
      history: history ?? []
    };
  }
}
