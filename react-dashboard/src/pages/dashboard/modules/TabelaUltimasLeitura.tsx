import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "../../../components/ui/table"
import { weatherCodesMap } from "../../../services/weatherCodesMap"
import { formatDateBR } from "../../../services/formater/data.formatter"
import type { WeatherRecord } from "../../../types/types"
import type { Dispatch, SetStateAction } from "react"
interface props {
    records: WeatherRecord[]
    page: number,
    totalPages: number,
    changePage: Dispatch<SetStateAction<number>>
}

export const TabelaUltimasLeitura: React.FC<props> = ({ records, page, totalPages, changePage }) => {
    return (<>
        <section className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
            <h3 className="text-lg font-semibold mb-4">Histórico</h3>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hora</TableHead>
                            <TableHead>Temp.</TableHead>
                            <TableHead>Humid.</TableHead>
                            <TableHead>Vento</TableHead>
                            <TableHead>Direção</TableHead>
                            <TableHead>Condição</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records && records.map((record, i) => <>
                            <TableRow key={`${record}-${i}`}>
                                <TableCell>{formatDateBR(record.time)}</TableCell>
                                <TableCell>{record.temperature}°C</TableCell>
                                <TableCell>{record.humidity}%</TableCell>
                                <TableCell>{record.windspeed} km/h</TableCell>
                                <TableCell>{record.windDirection}°</TableCell>
                                <TableCell>{weatherCodesMap[record.weatherCode as unknown as keyof typeof weatherCodesMap]?.name || "Unknown"} ({record.weatherCode})</TableCell>
                            </TableRow>
                        </>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex justify-between items-center mt-4">
                <button
                    onClick={() => changePage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-zinc-200 rounded disabled:opacity-40" >
                    Anterior
                </button>

                <span className="text-sm font-medium">
                    Página {page} de {totalPages}
                </span>

                <button
                    onClick={() => changePage((p) => Math.max(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-zinc-200 rounded disabled:opacity-40">
                    Próxima
                </button>
            </div>
        </section>
    </>)
}