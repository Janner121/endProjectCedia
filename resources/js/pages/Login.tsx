import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { HttpError } from '@/lib/api';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await login(email, password);
            void navigate('/dashboard');
        } catch (error) {
            if (error instanceof HttpError && error.errors) {
                setErrors(error.errors);
            } else {
                toast.error('No se pudo iniciar sesión. Intenta de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Iniciar sesión</CardTitle>
                    <CardDescription>
                        Ingresa a tu cuenta para ver tus plantas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">Correo</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    aria-invalid={!!errors.email}
                                />
                                <FieldError>{errors.email?.[0]}</FieldError>
                            </Field>

                            <Field data-invalid={!!errors.password}>
                                <FieldLabel htmlFor="password">
                                    Contraseña
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    aria-invalid={!!errors.password}
                                />
                                <FieldError>{errors.password?.[0]}</FieldError>
                            </Field>

                            <Button type="submit" disabled={isSubmitting}>
                                Entrar
                            </Button>
                        </FieldGroup>
                    </form>

                    <p className="text-muted-foreground mt-4 text-center text-sm">
                        ¿No tienes cuenta?{' '}
                        <Link
                            to="/register"
                            className="underline underline-offset-4"
                        >
                            Regístrate
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
