export interface WeatherInsight {
    summary: string;
    alerts: string[];
    classification: string;
    stats: {
        tempMin: number;
        tempMax: number;
        tempAvg: number;
        windMax: number;
        humidityMin: number;
        humidityMax: number;
        humidityAvg: number;
    };
}