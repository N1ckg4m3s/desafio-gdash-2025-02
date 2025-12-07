import { Controller, Get, Post, Body, HttpCode, UseGuards, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './create-weather.dto';
import { WeatherInsight } from 'src/types/types';
import { Roles } from 'src/http/decorators/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createWeatherDto: CreateWeatherDto) {
    console.log(`Adicionar dados de clima: ${JSON.stringify(createWeatherDto)}`)
    return await this.weatherService.create(createWeatherDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get('/insights')
  async getInsights(): Promise<WeatherInsight> {
    return this.weatherService.generateInsights();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get()
  async findAllOfToday(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const perPageNum = perPage ? parseInt(perPage, 10) : 10;
    return await this.weatherService.findAllOfToday({ page: pageNum, perPage: perPageNum });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get("/list")
  async findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const perPageNum = perPage ? parseInt(perPage, 10) : 10;
    return await this.weatherService.findAll({ page: pageNum, perPage: perPageNum });
  }
}
