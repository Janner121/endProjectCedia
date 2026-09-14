import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreatePlantDialog } from '@/components/create-plant-dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { estadoClass, estadoLabel } from '@/lib/estado';
import type { Plant, Species } from '@/types/models';

const estadoFilterLabel: Record<string, string> = {
    todas: 'Todas',
    ...estadoLabel,
};

export default function PlantsListPage() {
    const [plants, setPlants] = useState<Plant[] | null>(null);
    const [species, setSpecies] = useState<Species[]>([]);
    const [estado, setEstado] = useState('todas');
    const [ubicacion, setUbicacion] = useState('');
    const [speciesId, setSpeciesId] = useState('todas');
    const [sortProximo, setSortProximo] = useState(false);

    useEffect(() => {
        apiFetch<{ data: Species[] }>('/species')
            .then((res) => setSpecies(res.data))
            .catch(() =>
                toast.error('No se pudo cargar el catálogo de especies.'),
            );
    }, []);

    async function loadPlants(event?: FormEvent) {
        event?.preventDefault();

        const params = new URLSearchParams();
        if (estado !== 'todas') params.set('estado', estado);
        if (ubicacion.trim()) params.set('ubicacion', ubicacion.trim());
        if (speciesId !== 'todas') params.set('species_id', speciesId);
        if (sortProximo) params.set('sort', 'proximo_riego');

        try {
            const res = await apiFetch<{ data: Plant[] }>(
                `/plants?${params.toString()}`,
            );
            setPlants(res.data);
        } catch {
            toast.error('No se pudieron cargar las plantas.');
        }
    }

    useEffect(() => {
        void loadPlants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Mis plantas</h1>
                <CreatePlantDialog onCreated={() => void loadPlants()} />
            </div>

            <form
                onSubmit={loadPlants}
                className="flex flex-wrap items-end gap-3"
            >
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-sm font-medium"
                        htmlFor="filter-estado"
                    >
                        Estado
                    </label>
                    <Select
                        value={estado}
                        onValueChange={(value) => setEstado(value ?? 'todas')}
                    >
                        <SelectTrigger id="filter-estado">
                            <SelectValue>
                                {(value: string) =>
                                    estadoFilterLabel[value] ?? 'Estado'
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="todas">Todas</SelectItem>
                                <SelectItem value="atrasada">
                                    Atrasada
                                </SelectItem>
                                <SelectItem value="hoy">Hoy</SelectItem>
                                <SelectItem value="al_dia">Al día</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-sm font-medium"
                        htmlFor="filter-ubicacion"
                    >
                        Ubicación
                    </label>
                    <Input
                        id="filter-ubicacion"
                        placeholder="sala, balcón..."
                        value={ubicacion}
                        onChange={(event) => setUbicacion(event.target.value)}
                        className="w-40"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-sm font-medium"
                        htmlFor="filter-species"
                    >
                        Especie
                    </label>
                    <Select
                        value={speciesId}
                        onValueChange={(value) =>
                            setSpeciesId(value ?? 'todas')
                        }
                    >
                        <SelectTrigger id="filter-species">
                            <SelectValue>
                                {(value: string) =>
                                    value === 'todas'
                                        ? 'Todas'
                                        : (species.find(
                                              (item) =>
                                                  String(item.id) === value,
                                          )?.nombre_comun ?? 'Especie')
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="todas">Todas</SelectItem>
                                {species.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.nombre_comun}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="button"
                    variant={sortProximo ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortProximo((current) => !current)}
                >
                    Ordenar por próximo riego
                </Button>

                <Button type="submit" size="sm" variant="secondary">
                    Filtrar
                </Button>
            </form>

            {!plants ? (
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </div>
            ) : plants.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    No se encontraron plantas con esos filtros.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {plants.map((plant) => (
                        <Link key={plant.id} to={`/plants/${plant.id}`}>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardContent className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {plant.apodo}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    estadoClass[plant.estado]
                                                }
                                            >
                                                {estadoLabel[plant.estado]}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {plant.species.nombre_comun} ·{' '}
                                            {plant.ubicacion}
                                        </p>
                                    </div>
                                    {plant.proximo_riego && (
                                        <p className="text-muted-foreground text-sm">
                                            Próximo riego: {plant.proximo_riego}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
