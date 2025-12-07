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

export interface WeatherRecord {
    id: string
    time: string
    temperature: number
    windspeed: number
    windDirection: number
    isDay: boolean
    weatherCode: string,
    humidity: number
}

export type User = {
    id: string;
    username: string;
    name?: string;
    role: 'admin' | 'user' | string;
};

export type CreateEditUser = Omit<User, 'id'>