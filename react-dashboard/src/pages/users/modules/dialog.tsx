import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { toast } from "sonner"
import { ApiCaller } from "../../../services/apiCaller"
import type { User } from "../../../types/types"

interface props {
    isOpen: boolean
    setOpen: (value: any) => void,
    editingData?: Omit<User, 'password'> | null,
    success: () => void,
}

const validateFormUser = (form: { username: string; password: string; role: string }, isEditing?: boolean) => {
    if (!form.username.trim()) return { valid: false, message: 'Email é obrigatório' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.username)) return { valid: false, message: 'Email inválido' };

    if (!isEditing && !form.password.trim()) return { valid: false, message: 'Senha é obrigatória' };
    if (!isEditing && form.password.length < 6) return { valid: false, message: 'Senha deve ter no mínimo 6 caracteres' };

    const roles = ['user', 'admin'];
    if (!roles.includes(form.role)) return { valid: false, message: 'Role inválida' };

    return { valid: true };
}

export const EditCreateDialog: React.FC<props> = ({ isOpen, setOpen, editingData, success }) => {

    const isEditing = !!editingData;

    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        role: "user",
    });

    // Preenche ao abrir o modal
    useEffect(() => {
        if (editingData) {
            setForm({
                username: editingData.username,
                password: "",
                name: editingData.name || "",
                role: editingData.role
            });
        } else {
            setForm({
                username: "",
                password: "",
                name: "",
                role: "user"
            });
        }
    }, [editingData, isOpen]);

    async function handleSave() {
        const isValid = validateFormUser(form, isEditing);

        if (!isValid.valid) {
            toast.error(isValid.message);
            return;
        }

        ApiCaller({
            url: `http://localhost:3000/users/${editingData ? editingData.id : ''}`,
            method: isEditing ? 'PATCH' : 'POST',
            body: {
                email: form.username,
                password: form.password,
                name: form.name,
                role: form.role,
            },
            onError(error) {
                toast.error(`Erro ao salvar usuario: ${error.message}`)
            },
            onSuccess() {
                toast.success(isEditing ? 'Usuário atualizado' : 'Usuário criado');
                setOpen(false);
                success();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2">
                    <Input
                        placeholder="Email"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />

                    <Input
                        placeholder="Nome"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />

                    {!isEditing && (
                        <Input
                            placeholder="Senha"
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    )}

                    {isEditing && (
                        <select
                            className="border rounded px-2 py-1"
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    )}
                </div>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{isEditing ? 'Salvar' : 'Criar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
