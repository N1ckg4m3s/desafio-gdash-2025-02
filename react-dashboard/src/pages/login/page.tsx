import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ApiCaller } from "../../services/apiCaller";
import { useNavigate } from "react-router-dom";
import { ExecuteLogin } from "../../services/session";
import { toast } from "sonner";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            email: email.trim(),
            password: password.trim(),
        };

        ApiCaller({
            url: "http://localhost:3000/auth",
            method: "POST",
            body: payload,
            onSuccess: (response) => {
                const { access_token: token, user } = response;
                ExecuteLogin(token, user);
                setLoading(false);
                navigate('/dashboard');
            },
            onError: (err) => {
                toast.error(`Erro ao logar: ${err.type} | ${err.message}`)
                setError(err.data || "Erro ao fazer login");
                setLoading(false);
            }
        })
    };

    return (
        <div className="flex items-center justify-center h-screen p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>


                        <div>
                            <Input
                                placeholder="Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        {error && <p className="text-red-500 text-sm">{error}</p>}


                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}