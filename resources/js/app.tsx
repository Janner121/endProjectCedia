import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import DashboardPage from '@/pages/Dashboard';
import LoginPage from '@/pages/Login';
import PlantDetailPage from '@/pages/PlantDetail';
import PlantFormPage from '@/pages/PlantForm';
import PlantsListPage from '@/pages/PlantsList';
import RegisterPage from '@/pages/Register';

const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/plants', element: <PlantsListPage /> },
                    { path: '/plants/:id', element: <PlantDetailPage /> },
                    { path: '/plants/:id/edit', element: <PlantFormPage /> },
                ],
            },
        ],
    },
]);

const rootElement = document.getElementById('app');

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <Toaster />
        </StrictMode>,
    );
}
