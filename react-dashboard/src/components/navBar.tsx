import { useNavigate } from "react-router-dom";
import { ExecuteLogout, getUserToken } from "../services/session";
import { toast } from "sonner";

export const NavBar_component = () => {
    const navigate = useNavigate()

    function handleLogout() {
        ExecuteLogout();
    }

    const handleExport = async (type: "Csv" | "Xlsx") => {
        try {
            const token = getUserToken()

            if (!token) {
                toast.error('Usuario não logado')
                navigate(-1)
                return;
            }

            const response = await fetch(`http://localhost:3000/export/${type}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao exportar");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = type === "Csv" ? "weather.csv" : "weather.xlsx";
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Erro ao exportar");
        }
    };

    return (
        <nav className="w-full bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Weather Dashboard</h1>

            <button
                className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-all"
                onClick={() => navigate('/users')}
            >Usuários</button>

            <div className="flex gap-6">
                <button
                    className="px-4 py-2 rounded-lg bg-green-900 text-white cursor-pointer hover:bg-green-800 transition-all"
                    onClick={() => handleExport('Csv')}
                >Exportar como CSV</button>
                <button
                    className="px-4 py-2 rounded-lg bg-green-900 text-white cursor-pointer hover:bg-green-800 transition-all"
                    onClick={() => handleExport('Xlsx')}
                >Exportar como XLSX</button>

                <button
                    className="px-4 py-2 rounded-lg bg-zinc-900 text-white cursor-pointer hover:bg-zinc-800 transition-all"
                    onClick={handleLogout}
                >Logout</button>
            </div>
        </nav>
    )
}