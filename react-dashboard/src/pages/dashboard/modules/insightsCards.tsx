import { useEffect, useState } from "react";
import type { WeatherInsight } from "../../../types/types";
import { ApiCaller } from "../../../services/apiCaller";
import { DashboardCard } from "../../../components/dashboardCard";
import { toast } from "sonner";

export const InsightCards = () => {
    const [insights, setInsights] = useState<WeatherInsight | null>({
        alerts: [],
        classification: "Clima agradável",
        stats: {
            tempAvg: 24,
            tempMax: 24.3,
            tempMin: 24.3,
            windMax: 2.3,
            humidityMin: 0,
            humidityMax: 0,
            humidityAvg: 0
        },
        summary: "Nos últimos 1 registros, a temperatura média foi 24°C, mínima 24.3°C, máxima 24.3"
    });
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ApiCaller({
            url: "http://localhost:3000/weather/insights",
            method: "GET",
            onSuccess: (response) => {
                setInsights(response || [])
                setLoading(false)
            },
            onError: (err) => {
                toast.error(err.message || "Erro ao buscar dados")
                if (err.type === "FORBIDDEN") {
                    alert("Sem permissão");
                }
            }
        })
    }, [])

    if (loading || insights == null) {
        return <>
            <section className="grid grid-cols-3 gap-6 mb-6">
                <DashboardCard
                    title="Resumo"
                    value={loading ? '...' : '<no data>'}
                    layout="text"
                />
                <DashboardCard
                    title="Classificação"
                    value={loading ? '...' : '<no data>'}
                    layout="text"
                />
                <DashboardCard
                    title="Alertas"
                    value={loading ? '...' : '<no data>'}
                    icon="⚠️"
                    layout="text"
                />
            </section>
        </>
    }

    return (<>
        <section className="flex flex-col">
            <section className="grid grid-cols-3 gap-6 mb-6">
                <DashboardCard
                    title="Resumo"
                    value={insights.classification}
                    layout="text"
                />
                <DashboardCard
                    title="Classificação"
                    value={insights.classification}
                    layout="text"
                />
                <DashboardCard
                    title="Alertas"
                    value={insights.alerts.length > 0 ? insights.alerts.join(", ") : 'Sem aleta, aproveite :)'}
                    icon="⚠️"
                    layout="text"
                />
            </section>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-2">
                <span> {insights.summary} </span>
            </div>

        </section>
    </>)
}