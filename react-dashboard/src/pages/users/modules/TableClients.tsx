import { Pencil, Trash } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tooltip } from "../../../components/ui/tooltip"
import type { User } from "../../../types/types"
import { CardContent } from "../../../components/ui/card"
import { ApiCaller } from "../../../services/apiCaller"
import { toast } from "sonner"
import type { Dispatch, SetStateAction } from "react"

interface props {
    users: User[]
    openEdit: (u: User) => void
    update: () => void
    page: number,
    totalPages: number,
    changePage: Dispatch<SetStateAction<number>>
}

export const ClientsTable: React.FC<props> = ({ users, openEdit, page, totalPages, changePage, update }) => {
    const handleDelete = (id: string) => {
        ApiCaller({
            url: `http://localhost:3000/users/${id}`,
            method: 'DELETE',
            onError(error) {
                toast.error(`Erro ao apagar o usuario: ${error.message}`)
            },
            onSuccess() {
                toast.success(`Usuario apagado com sucesso`)
                update()
            },
        })
    }

    return (
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead className="text-center">Nome</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Role</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((u, i) => (
                        <TableRow key={`${u.id}-${i}`}>
                            <TableCell className="text-center">{u.id}</TableCell>
                            <TableCell className="text-center">{u.name}</TableCell>
                            <TableCell className="text-center">{u.username}</TableCell>
                            <TableCell className="text-center">{u.role}</TableCell>
                            <TableCell className="text-center flex justify-center gap-2">
                                <Tooltip>
                                    <Button onClick={() => openEdit(u)} variant="ghost" size="sm" className="p-2">
                                        <Pencil size={14} />
                                    </Button>
                                </Tooltip>
                                <Tooltip>
                                    <Button onClick={() => handleDelete(u.id)} variant="destructive" size="sm" className="p-2">
                                        <Trash size={14} />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
                <div>Mostrando {users.length} de {totalPages}</div>
                <div className="flex gap-2">
                    <Button onClick={() => changePage((p) => Math.max(1, p - 1))}>Anterior</Button>
                    <div className="flex items-center px-3">{page}</div>
                    <Button onClick={() => changePage((p) => Math.max(p + 1, totalPages))}>Próxima</Button>
                </div>
            </div>
        </CardContent >
    )
}