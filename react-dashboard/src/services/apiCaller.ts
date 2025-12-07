import { ExecuteLogout } from "./session";

interface ControllerProps {
    url: string;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
    body?: Record<string, any>;
    params?: Record<string, any>;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
}

const getUserToken = () => {
    return localStorage.getItem("token");
}

/**
 * Chama a API com base na URL, método e parâmetros fornecidos.
 * Centraliza o tratamento de requisições e erros.
 * 
 * @param {Object} param0 - Objeto de configuração da requisição
 * @param {string} param0.url - Endpoint da API
 * @param {'GET'|'POST'|'PUT'|'DELETE'} param0.method - Método HTTP
 * @param {Record<string, any>} [param0.body] - Dados a serem enviados no corpo da requisição (JSON)
 * @param {Record<string, any>} [param0.params] - Parâmetros de query string para GET/DELETE
 * @param {(data: any) => void} param0.onSuccess - Callback chamado quando a requisição é bem-sucedida, recebe os dados
 * @param {(error: any) => void} param0.onError - Callback chamado em caso de erro, recebe o erro
 */
export const ApiCaller = async ({ url, method, body, params, onSuccess, onError }: ControllerProps) => {
    try {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';

        const response = await fetch(url + queryString, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getUserToken()}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        // checagem de status
        if (!response.ok) {
            const error = await ErrorInterceptor(response);
            onError(error);
            return;
        }

        const data = await response.json();

        onSuccess(data);
    } catch (err) {
        onError({
            status: null,
            type: "SERVER_ERROR",
            body: err
        });
    }
}

const ErrorInterceptor = async (response: Response) => {
    const status = response.status;
    let message = "Unexpected error";
    let type = "UNKNOWN";

    // Tenta pegar body JSON (às vezes o back envia uma mensagem)
    let body: any = null;
    try {
        body = await response.json();
    } catch (_) {
        body = null;
    }

    if (status === 401) {
        ExecuteLogout();
    }

    else if (status === 403) {
        type = "FORBIDDEN";
        message = body?.message || "Invalid token or insufficient permissions";
    }

    else if (status === 404) {
        type = "NOT_FOUND";
        message = body?.message || "Resource not found";
    }

    else if (status >= 500) {
        type = "SERVER_ERROR";
        message = body?.message || "Internal server error";
    }

    return {
        status,
        type,
        message,
        body
    };
};
