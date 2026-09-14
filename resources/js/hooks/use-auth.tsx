import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { apiFetch, getToken, setToken } from '@/lib/api';

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthResponse = {
    user: User;
    token: string;
};

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
        passwordConfirmation: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!getToken()) {
            setIsLoading(false);
            return;
        }

        apiFetch<User>('/user')
            .then(setUser)
            .catch(() => setToken(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const data = await apiFetch<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        setToken(data.token);
        setUser(data.user);
    }

    async function register(
        name: string,
        email: string,
        password: string,
        passwordConfirmation: string,
    ) {
        const data = await apiFetch<AuthResponse>('/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });

        setToken(data.token);
        setUser(data.user);
    }

    async function logout() {
        try {
            await apiFetch('/logout', { method: 'POST' });
        } finally {
            setToken(null);
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
