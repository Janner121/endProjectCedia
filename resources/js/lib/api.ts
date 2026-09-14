const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

type ApiErrorBody = {
    message: string;
    errors?: Record<string, string[]>;
};

export class HttpError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(status: number, body: ApiErrorBody) {
        super(body.message);
        this.status = status;
        this.errors = body.errors;
    }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`/api${path}`, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return undefined as T;
    }

    const body = await response.json();

    if (!response.ok) {
        throw new HttpError(response.status, body);
    }

    return body as T;
}
