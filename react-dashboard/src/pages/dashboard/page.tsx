import { NavBar_component } from "../../components/navBar"
import { useEffect, useState } from "react"
import { weatherCodesMap } from "../../services/weatherCodesMap"
import { ApiCaller } from "../../services/apiCaller"
import type { WeatherRecord } from "../../types/types"
import { InsightCards } from "./modules/insightsCards"
import { InformationsCards } from "./modules/InformationsCards"
import { TabelaUltimasLeitura } from "./modules/TabelaUltimasLeitura"
import { GraficosInformativos } from "./modules/ListaDeGraficos"
import LoadingComponent from "../../components/loading"
import { toast } from "sonner"

export default function Dashboard() {
  const [data, setData] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ApiCaller({
      url: "http://localhost:3000/weather",
      params: {
        page,
        perPage
      },
      method: "GET",
      onSuccess: (response) => {
        setPage(0),
          setTotal(response.total ?? 0)
        setData(response.history ?? []);
        setLoading(false);
      },
      onError: (err) => {
        toast.error(err.message || "Erro ao buscar dados")
        setError(err.message || "Erro ao buscar dados");
        setLoading(false);
      },
    });
  }, []);

  const firstItem = data[0];

  if (loading) { return <LoadingComponent /> }
  if (!firstItem) { return <FrezzePage /> }

  const weatherCodes = weatherCodesMap[firstItem.weatherCode as unknown as keyof typeof weatherCodesMap]

  return (<>
    <div className="min-h-screen text-zinc-900">
      <NavBar_component />

      <main className="p-6 grid gap-6">
        {loading && <LoadingComponent />}
        {error && <div className="text-red-600 font-bold">{error}</div>}
        {!loading && !error && (
          <>
            {/* Gera os cards de insight */}
            <InsightCards />

            {/* Gera os cards de insight */}
            <InformationsCards
              condition={{
                code: firstItem.weatherCode,
                icon: weatherCodes?.icon || "",
                description: weatherCodes?.name || "Unknown"
              }}
              isDay={firstItem.isDay}
              temperature={firstItem.temperature.toString() + "°C"}
              wind={{
                speed: firstItem.windspeed.toString() + " km/h",
                direction: firstItem.windDirection.toString() + "°"
              }}
            />

            {/* Gerar os graficos */}
            <GraficosInformativos
              informacoes={data}
            />

            {/* Gerar o historico de registro */}
            <TabelaUltimasLeitura
              changePage={setPage}
              page={page}
              records={data}
              totalPages={total}
            />
          </>
        )}
      </main>
    </div>
  </>)
}

const FrezzePage = () => <>
  <div className="min-h-screen text-zinc-900">
    <NavBar_component />

    <main className="p-6 grid gap-6">

      {/* Gera os cards de insight */}
      <InsightCards />

      {/* Gera os cards de insight */}
      <InformationsCards
        condition={{
          code: '0',
          icon: "",
          description: "no description"
        }}
        isDay={true}
        temperature={"0°C"}
        wind={{
          speed: "0km/h",
          direction: "0°"
        }}
      />

      {/* Gerar os graficos */}
      <GraficosInformativos
        informacoes={[]}
      />

      {/* Gerar o historico de registro */}
      <TabelaUltimasLeitura
        changePage={() => { }}
        page={1}
        records={[]}
        totalPages={1}
      />
    </main>
  </div>
</>