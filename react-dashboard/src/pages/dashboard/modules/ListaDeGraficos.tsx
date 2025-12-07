import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { WeatherRecord } from "../../../types/types"
import { formatHourTimeBR } from "../../../services/formater/data.formatter"

interface props {
    informacoes: WeatherRecord[]
}

export const GraficosInformativos: React.FC<props> = ({ informacoes }) => {
    const dataTemperature = informacoes.map(info => ({
        time: new Date(info.time),
        temperature: info.temperature
    }));

    const dataHumidity = informacoes.map(info => ({
        time: new Date(info.time),
        humidity: info.humidity
    }));

    return (<>
        <section className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
            <h3 className="text-lg font-semibold mb-4">Temperatura (últimas leituras)</h3>
            <div className="flex gap-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-200 flex-1">
                    <h3 className="text-lg font-semibold mb-4">Temperatura</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={dataTemperature}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={(time) => formatHourTimeBR(time)}
                            />
                            <YAxis />
                            <Tooltip labelFormatter={(time) => formatHourTimeBR(time)} />
                            <Line type="monotone" dataKey="temperature" stroke="#FF0000" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-200 flex-1">
                    <h3 className="text-lg font-semibold mb-4">Umidade</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={dataHumidity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={(time) => formatHourTimeBR(time)}
                            />
                            <YAxis />
                            <Tooltip labelFormatter={(time) => formatHourTimeBR(time)} />
                            <Line type="monotone" dataKey="humidity" stroke="#0000FF" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    </>)
}