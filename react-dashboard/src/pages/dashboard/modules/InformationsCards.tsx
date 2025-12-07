import { DashboardCard } from "../../../components/dashboardCard"

interface ComponentProps {
    temperature: string;
    condition: {
        code: string;
        icon: string;
        description: string;
    };
    wind: {
        direction: string;
        speed: string;
    };
    isDay: boolean;
}

export const InformationsCards: React.FC<ComponentProps> = ({ temperature, condition, wind, isDay }) => {
    return (<>
        <section className="grid grid-cols-4 gap-6">
            <DashboardCard
                title="Temperatua"
                value={temperature}
                info="Atualizado: 03:30"
            />

            <DashboardCard
                title="Condição"
                icon="🌦️"
                value={condition.description}
                info={`Codigo: ${condition.code}`}
                layout="icon"
            />

            <DashboardCard
                title="Vento"
                value={wind.speed}
                info={`Direção: (${wind.direction})`}
            />

            <DashboardCard
                title="Período"
                value={isDay ? "Dia" : "Noite"}
                icon={isDay ? "☀" : "🌙"}
                layout="icon"
            />
        </section>
    </>)
}