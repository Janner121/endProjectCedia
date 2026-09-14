import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { estadoClass, estadoLabel } from '@/lib/estado';
import type { DashboardData, Plant } from '@/types/models';

type PlantList = 'pendientes_hoy' | 'atrasadas';

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [wateringId, setWateringId] = useState<number | null>(null);

    useEffect(() => {
        apiFetch<DashboardData>('/dashboard')
            .then(setData)
            .catch(() => toast.error('No se pudo cargar el tablero.'));
    }, []);

    async function regarHoy(plant: Plant, list: PlantList) {
        setWateringId(plant.id);

        try {
            await apiFetch(`/plants/${plant.id}/waterings`, {
                method: 'POST',
                body: JSON.stringify({
                    fecha: new Date().toISOString().slice(0, 10),
                }),
            });

            setData((current) =>
                current
                    ? {
                          ...current,
                          [list]: current[list].filter(
                              (p) => p.id !== plant.id,
                          ),
                      }
                    : current,
            );
            toast.success(`${plant.apodo} regada.`);
        } catch {
            toast.error('No se pudo registrar el riego.');
        } finally {
            setWateringId(null);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>

            {!data ? (
                <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Riegos últimos 7 días
                                </CardDescription>
                                <CardTitle className="text-3xl">
                                    {data.riegos_ultimos_7_dias}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Atrasadas</CardDescription>
                                <CardTitle className="text-3xl">
                                    {data.atrasadas.length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Pendientes hoy
                                </CardDescription>
                                <CardTitle className="text-3xl">
                                    {data.pendientes_hoy.length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <PlantSection
                        title="Atrasadas"
                        plants={data.atrasadas}
                        emptyText="No tienes plantas atrasadas."
                        onRegar={(plant) => regarHoy(plant, 'atrasadas')}
                        wateringId={wateringId}
                    />

                    <PlantSection
                        title="Pendientes hoy"
                        plants={data.pendientes_hoy}
                        emptyText="No tienes plantas pendientes de riego hoy."
                        onRegar={(plant) => regarHoy(plant, 'pendientes_hoy')}
                        wateringId={wateringId}
                    />

                    {Object.keys(data.total_por_ubicacion).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Plantas por ubicación</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {Object.entries(data.total_por_ubicacion).map(
                                    ([ubicacion, total]) => (
                                        <Badge
                                            key={ubicacion}
                                            variant="secondary"
                                        >
                                            {ubicacion}: {total}
                                        </Badge>
                                    ),
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

function PlantSection({
    title,
    plants,
    emptyText,
    onRegar,
    wateringId,
}: {
    title: string;
    plants: Plant[];
    emptyText: string;
    onRegar: (plant: Plant) => Promise<void>;
    wateringId: number | null;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {plants.length === 0 && (
                    <p className="text-muted-foreground text-sm">{emptyText}</p>
                )}
                {plants.map((plant) => (
                    <div
                        key={plant.id}
                        className="flex items-center justify-between gap-4 rounded-lg border p-3"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {plant.apodo}
                                </span>
                                <Badge
                                    variant="outline"
                                    className={estadoClass[plant.estado]}
                                >
                                    {estadoLabel[plant.estado]}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {plant.species.nombre_comun} · {plant.ubicacion}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            disabled={wateringId === plant.id}
                            onClick={() => void onRegar(plant)}
                        >
                            Regar hoy
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
