import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch, HttpError } from '@/lib/api';
import { estadoClass, estadoLabel } from '@/lib/estado';
import type { Plant } from '@/types/models';

const macetaLabel: Record<string, string> = {
    barro: 'Barro',
    plastico: 'Plástico',
    suelo: 'Suelo',
};

export default function PlantDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [fecha, setFecha] = useState(() =>
        new Date().toISOString().slice(0, 10),
    );
    const [cantidadMl, setCantidadMl] = useState('');
    const [fertilizante, setFertilizante] = useState(false);
    const [observacion, setObservacion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    function loadPlant() {
        apiFetch<{ data: Plant }>(`/plants/${id}`)
            .then((res) => setPlant(res.data))
            .catch(() => toast.error('No se pudo cargar la planta.'));
    }

    useEffect(() => {
        loadPlant();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function handleAddWatering(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await apiFetch(`/plants/${id}/waterings`, {
                method: 'POST',
                body: JSON.stringify({
                    fecha,
                    cantidad_ml: cantidadMl ? Number(cantidadMl) : null,
                    fertilizante,
                    observacion: observacion || null,
                }),
            });

            toast.success('Riego registrado.');
            setCantidadMl('');
            setObservacion('');
            setFertilizante(false);
            loadPlant();
        } catch (error) {
            toast.error(
                error instanceof HttpError
                    ? error.message
                    : 'No se pudo registrar el riego.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteWatering(wateringId: number) {
        try {
            await apiFetch(`/waterings/${wateringId}`, { method: 'DELETE' });
            toast.success('Riego eliminado.');
            loadPlant();
        } catch {
            toast.error('No se pudo eliminar el riego.');
        }
    }

    async function handleDeletePlant() {
        try {
            await apiFetch(`/plants/${id}`, { method: 'DELETE' });
            setConfirmOpen(false);
            toast.success('Planta eliminada.');
            void navigate('/plants');
        } catch {
            toast.error('No se pudo eliminar la planta.');
        }
    }

    if (!plant) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-40" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">{plant.apodo}</h1>
                        <Badge
                            variant="outline"
                            className={estadoClass[plant.estado]}
                        >
                            {estadoLabel[plant.estado]}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {plant.species.nombre_comun} · {plant.ubicacion} ·
                        maceta de {macetaLabel[plant.maceta]}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to={`/plants/${plant.id}/edit`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                        })}
                    >
                        Editar
                    </Link>
                    <AlertDialog
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                    >
                        <AlertDialogTrigger
                            render={<Button variant="destructive" size="sm" />}
                        >
                            Eliminar
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Eliminar {plant.apodo}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Se borrará también todo su historial de
                                    riegos. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={() => void handleDeletePlant()}
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registrar riego</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleAddWatering}
                        className="flex flex-wrap items-end gap-3"
                    >
                        <Field className="w-auto">
                            <FieldLabel htmlFor="fecha">Fecha</FieldLabel>
                            <Input
                                id="fecha"
                                type="date"
                                required
                                value={fecha}
                                onChange={(event) =>
                                    setFecha(event.target.value)
                                }
                            />
                        </Field>

                        <Field className="w-auto">
                            <FieldLabel htmlFor="cantidad_ml">
                                Cantidad (ml)
                            </FieldLabel>
                            <Input
                                id="cantidad_ml"
                                type="number"
                                min={1}
                                className="w-28"
                                value={cantidadMl}
                                onChange={(event) =>
                                    setCantidadMl(event.target.value)
                                }
                            />
                        </Field>

                        <Field orientation="horizontal" className="w-auto">
                            <Checkbox
                                id="fertilizante"
                                checked={fertilizante}
                                onCheckedChange={(checked) =>
                                    setFertilizante(checked)
                                }
                            />
                            <FieldLabel htmlFor="fertilizante">
                                Con fertilizante
                            </FieldLabel>
                        </Field>

                        <Field className="min-w-48 flex-1">
                            <FieldLabel htmlFor="observacion">
                                Observación
                            </FieldLabel>
                            <Input
                                id="observacion"
                                value={observacion}
                                onChange={(event) =>
                                    setObservacion(event.target.value)
                                }
                            />
                        </Field>

                        <Button type="submit" disabled={isSubmitting}>
                            Registrar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de riegos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {plant.waterings?.length ? (
                        plant.waterings.map((watering) => (
                            <div
                                key={watering.id}
                                className="flex items-center justify-between gap-4 rounded-lg border p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {watering.fecha}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {watering.cantidad_ml
                                            ? `${watering.cantidad_ml} ml`
                                            : 'Cantidad no especificada'}
                                        {watering.fertilizante &&
                                            ' · con fertilizante'}
                                        {watering.observacion &&
                                            ` · ${watering.observacion}`}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        void handleDeleteWatering(watering.id)
                                    }
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            Todavía no hay riegos registrados.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
