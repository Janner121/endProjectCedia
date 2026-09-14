import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
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
import { apiFetch, HttpError } from '@/lib/api';
import type { Plant, Species } from '@/types/models';

const macetas = [
    { value: 'barro', label: 'Barro' },
    { value: 'plastico', label: 'Plástico' },
    { value: 'suelo', label: 'Suelo' },
];

export default function PlantFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [species, setSpecies] = useState<Species[]>([]);
    const [speciesId, setSpeciesId] = useState('');
    const [apodo, setApodo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [maceta, setMaceta] = useState('');
    const [frecuenciaDias, setFrecuenciaDias] = useState('');
    const [fechaAdquisicion, setFechaAdquisicion] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiFetch<{ data: Species[] }>('/species')
            .then((res) => setSpecies(res.data))
            .catch(() =>
                toast.error('No se pudo cargar el catálogo de especies.'),
            );
    }, []);

    useEffect(() => {
        apiFetch<{ data: Plant }>(`/plants/${id}`)
            .then((res) => {
                const plant = res.data;
                setSpeciesId(String(plant.species.id));
                setApodo(plant.apodo);
                setUbicacion(plant.ubicacion);
                setMaceta(plant.maceta);
                setFrecuenciaDias(String(plant.frecuencia_dias));
                setFechaAdquisicion(plant.fecha_adquisicion ?? '');
            })
            .catch(() => toast.error('No se pudo cargar la planta.'))
            .finally(() => setIsLoading(false));
    }, [id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await apiFetch(`/plants/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    species_id: Number(speciesId),
                    apodo,
                    ubicacion,
                    maceta,
                    frecuencia_dias: Number(frecuenciaDias),
                    fecha_adquisicion: fechaAdquisicion || null,
                }),
            });

            toast.success('Planta actualizada.');
            void navigate(`/plants/${id}`);
        } catch (error) {
            if (error instanceof HttpError && error.errors) {
                setErrors(error.errors);
            } else {
                toast.error('No se pudo guardar la planta.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-96 max-w-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold">Editar planta</h1>

            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Datos de la planta</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field data-invalid={!!errors.apodo}>
                                <FieldLabel htmlFor="apodo">Apodo</FieldLabel>
                                <Input
                                    id="apodo"
                                    required
                                    value={apodo}
                                    onChange={(event) =>
                                        setApodo(event.target.value)
                                    }
                                    aria-invalid={!!errors.apodo}
                                />
                                <FieldError>{errors.apodo?.[0]}</FieldError>
                            </Field>

                            <Field data-invalid={!!errors.species_id}>
                                <FieldLabel htmlFor="species_id">
                                    Especie
                                </FieldLabel>
                                <Select
                                    value={speciesId}
                                    onValueChange={(value) =>
                                        setSpeciesId(value ?? '')
                                    }
                                >
                                    <SelectTrigger
                                        id="species_id"
                                        aria-invalid={!!errors.species_id}
                                    >
                                        <SelectValue>
                                            {(value: string | null) =>
                                                value
                                                    ? species.find(
                                                          (item) =>
                                                              String(
                                                                  item.id,
                                                              ) === value,
                                                      )?.nombre_comun
                                                    : 'Selecciona una especie'
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
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
                                <FieldError>
                                    {errors.species_id?.[0]}
                                </FieldError>
                            </Field>

                            <Field data-invalid={!!errors.ubicacion}>
                                <FieldLabel htmlFor="ubicacion">
                                    Ubicación
                                </FieldLabel>
                                <Input
                                    id="ubicacion"
                                    placeholder="sala, balcón, oficina..."
                                    required
                                    value={ubicacion}
                                    onChange={(event) =>
                                        setUbicacion(event.target.value)
                                    }
                                    aria-invalid={!!errors.ubicacion}
                                />
                                <FieldError>{errors.ubicacion?.[0]}</FieldError>
                            </Field>

                            <Field data-invalid={!!errors.maceta}>
                                <FieldLabel htmlFor="maceta">Maceta</FieldLabel>
                                <Select
                                    value={maceta}
                                    onValueChange={(value) =>
                                        setMaceta(value ?? '')
                                    }
                                >
                                    <SelectTrigger
                                        id="maceta"
                                        aria-invalid={!!errors.maceta}
                                    >
                                        <SelectValue>
                                            {(value: string | null) =>
                                                value
                                                    ? macetas.find(
                                                          (item) =>
                                                              item.value ===
                                                              value,
                                                      )?.label
                                                    : 'Selecciona el tipo de maceta'
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {macetas.map((item) => (
                                                <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.maceta?.[0]}</FieldError>
                            </Field>

                            <Field data-invalid={!!errors.frecuencia_dias}>
                                <FieldLabel htmlFor="frecuencia_dias">
                                    Frecuencia de riego (días)
                                </FieldLabel>
                                <Input
                                    id="frecuencia_dias"
                                    type="number"
                                    min={1}
                                    max={255}
                                    required
                                    value={frecuenciaDias}
                                    onChange={(event) =>
                                        setFrecuenciaDias(event.target.value)
                                    }
                                    aria-invalid={!!errors.frecuencia_dias}
                                />
                                <FieldError>
                                    {errors.frecuencia_dias?.[0]}
                                </FieldError>
                            </Field>

                            <Field data-invalid={!!errors.fecha_adquisicion}>
                                <FieldLabel htmlFor="fecha_adquisicion">
                                    Fecha de adquisición (opcional)
                                </FieldLabel>
                                <Input
                                    id="fecha_adquisicion"
                                    type="date"
                                    value={fechaAdquisicion}
                                    onChange={(event) =>
                                        setFechaAdquisicion(event.target.value)
                                    }
                                    aria-invalid={!!errors.fecha_adquisicion}
                                />
                                <FieldError>
                                    {errors.fecha_adquisicion?.[0]}
                                </FieldError>
                            </Field>

                            <Button type="submit" disabled={isSubmitting}>
                                Guardar cambios
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
