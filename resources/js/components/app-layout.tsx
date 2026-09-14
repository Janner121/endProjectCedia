import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/plants', label: 'Mis plantas' },
];

export function AppLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-svh">
            <header className="flex items-center justify-between border-b p-4">
                <nav className="flex items-center gap-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                cn(
                                    'text-muted-foreground hover:text-foreground text-sm font-medium',
                                    isActive && 'text-foreground',
                                )
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">
                        {user?.email}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void logout()}
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl p-6">
                <Outlet />
            </div>
        </div>
    );
}
