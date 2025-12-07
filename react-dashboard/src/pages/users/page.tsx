// import { useEffect, useState } from 'react';

import { useEffect, useState } from "react";
import type { User } from "../../types/types";
import { Card } from "../../components/ui/card";
import { FiltrosDePesquisa } from "./modules/searchFilters";
import { ApiCaller } from "../../services/apiCaller";
import { ClientsTable } from "./modules/TableClients";
import { EditCreateDialog } from "./modules/dialog";
import { toast } from "sonner";
import LoadingComponent from "../../components/loading";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // dialog state
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<User, 'password'> | null>(null);

  // paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  function openCreate() {
    setEditingUser(null);
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setOpen(true);
  }

  const fetchUsers = (query = '') => {
    setLoading(true)
    setError(null)

    ApiCaller({
      url: "http://localhost:3000/users/get-all",
      method: "GET",
      params: {
        page,
        perPage,
        query
      },
      onError(error) {
        if (error.type === "FORBIDDEN") {
          navigate(-1)
        }
        toast.error(error.message)
        setError(error.message)
        setLoading(false)
      },
      onSuccess(data) {
        setPage(1)
        setTotal(data.total ?? 0)
        setUsers(data.users || [])
        setLoading(false)
      },
    })
  }

  useEffect(() => fetchUsers(), [])

  return (
    <>
      <nav className="w-full bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lista de clientes</h1>
        <button
          className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all"
          onClick={() => navigate(-1)}
        >Voltar</button>
      </nav>
      <div className="p-4">
        <Card>
          {/* FILTROS DA PAGINA */}
          <FiltrosDePesquisa
            fetchUsers={fetchUsers}
            openCreate={openCreate}
          />
          {loading ? (
            <LoadingComponent />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (<>
            {/* TABELA COM PAGINAÇÃO */}
            <ClientsTable
              users={users}
              openEdit={openEdit}
              changePage={setPage}
              page={page}
              totalPages={total}
              update={fetchUsers}
            />
          </>)}
        </Card>
        <EditCreateDialog
          isOpen={open}
          setOpen={setOpen}
          editingData={editingUser}
          success={() => {
            setOpen(false)
            fetchUsers();
          }}
        />
      </div>
    </>
  )
}