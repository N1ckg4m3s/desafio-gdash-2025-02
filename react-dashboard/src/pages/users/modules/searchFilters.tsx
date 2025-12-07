import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useState } from "react";

interface props {
    fetchUsers: (query?: string) => void
    openCreate: () => void
}


export const FiltrosDePesquisa: React.FC<props> = ({ fetchUsers, openCreate }) => {
    const [query, setQuery] = useState('');

    return (
        <>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Usuários</CardTitle>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Buscar email"
                        value={query}
                        onChange={(e: any) => { setQuery(e.target.value); }}
                        className="w-64"
                    />
                    <Button onClick={() => fetchUsers(query)}>Buscar</Button>
                    <Button onClick={openCreate} variant="default" className="flex items-center gap-2">
                        <Plus size={16} /> Novo
                    </Button>
                </div>
            </CardHeader>
        </>
    )
}