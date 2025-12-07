import * as XLSX from 'xlsx'
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
    private generateWork = (data: any[]) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        return { worksheet, workbook }
    }

    gerarArquivoCsv(data: any[], filename: string): Buffer {
        const { worksheet, workbook } = this.generateWork(data)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const csv = XLSX.utils.sheet_to_csv(worksheet);
        return Buffer.from(csv, 'utf-8');
    }

    gerarArquivoXlsx(data: any[], filename: string): Buffer {
        const { worksheet, workbook } = this.generateWork(data)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }

}
