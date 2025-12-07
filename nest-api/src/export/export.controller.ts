import { Controller, Get, NotFoundException, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { WeatherService } from 'src/weather/weather.service';
import { Roles } from 'src/http/decorators/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';

@Controller('export')
export class ExportController {
    constructor(
        private readonly exportService: ExportService,
        private readonly weatherService: WeatherService
    ) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Get('/Csv')
    async exportCsv(@Res() res: Response) {
        const { history } = await this.weatherService.findAllOfToday();

        if (!history || history.length === 0) {
            throw new NotFoundException('Não foi possivel encontrar os dados para exportação')
        }

        const fileBuffer = this.exportService.gerarArquivoCsv(history, 'weather.csv');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="weather.csv"');
        res.send(fileBuffer);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Get('/Xlsx')
    async exportXlsx(@Res() res: Response) {
        const { history } = await this.weatherService.findAllOfToday();

        if (!history || history.length === 0) {
            throw new NotFoundException('Não foi possivel encontrar os dados para exportação')
        }

        const fileBuffer = this.exportService.gerarArquivoXlsx(history, 'weather.xlsx');

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename="weather.xlsx"');
        res.send(fileBuffer);
    }
}
