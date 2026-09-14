import { type FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { apiFetch, HttpError } from '@/lib/api';
import type { Species } from '@/types/models';

const macetas = [
    { value: 'barro', label: 'Barro' },
    { value: 'plastico', label: 'Plástico' },
    { value: 'suelo', label: 'Suelo' },
];

export function CreatePlantDialog({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [species, setSpecies] = useState<Species[]>([]);
    const [speciesId, setSpeciesId] = useState('');
    const [apodo, setApodo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [maceta, setMaceta] = useState('');
    const [frecuenciaDias, setFrecuenciaDias] = useState('');
    const [fechaAdquisicion, setFechaAdquisicion] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        apiFetch<{ data: Species[] }>('/species')
            .then((res) => setSpecies(res.data))
            .catch(() =>
                toast.error('No se pudo cargar el catálogo de especies.'),
            );
    }, [open]);

    function resetForm() {
        setSpeciesId('');
        setApodo('');
        setUbicacion('');
        setMaceta('');
        setFrecuenciaDias('');
        setFechaAdquisicion('');
        setErrors({});
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await apiFetch('/plants', {
                method: 'POST',
                body: JSON.stringify({
                    species_id: Number(speciesId),
                    apodo,
                    ubicacion,
                    maceta,
                    frecuencia_dias: Number(frecuenciaDias),
                    fecha_adquisicion: fechaAdquisicion || null,
                }),
            });

            toast.success('Planta agregada.');
            resetForm();
            setOpen(false);
            onCreated();
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

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    resetForm();
                }
            }}
        >
            <DialogTrigger render={<Button size="sm" />}>
                Agregar planta
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar planta</DialogTitle>
                    <DialogDescription>
                        Completa los datos de tu nueva planta.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.apodo}>
                            <FieldLabel htmlFor="dialog-apodo">
                                Apodo
                            </FieldLabel>
                            <Input
                                id="dialog-apodo"
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
                            <FieldLabel htmlFor="dialog-species_id">
                                Especie
                            </FieldLabel>
                            <Select
                                value={speciesId}
                                onValueChange={(value) =>
                                    setSpeciesId(value ?? '')
                                }
                            >
                                <SelectTrigger
                                    id="dialog-species_id"
                                    aria-invalid={!!errors.species_id}
                                >
                                    <SelectValue>
                                        {(value: string | null) =>
                                            value
                                                ? species.find(
                                                      (item) =>
                                                          String(item.id) ===
                                                          value,
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
                            <FieldError>{errors.species_id?.[0]}</FieldError>
                        </Field>

                        <Field data-invalid={!!errors.ubicacion}>
                            <FieldLabel htmlFor="dialog-ubicacion">
                                Ubicación
                            </FieldLabel>
                            <Input
                                id="dialog-ubicacion"
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
                            <FieldLabel htmlFor="dialog-maceta">
                                Maceta
                            </FieldLabel>
                            <Select
                                value={maceta}
                                onValueChange={(value) =>
                                    setMaceta(value ?? '')
                                }
                            >
                                <SelectTrigger
                                    id="dialog-maceta"
                                    aria-invalid={!!errors.maceta}
                                >
                                    <SelectValue>
                                        {(value: string | null) =>
                                            value
                                                ? macetas.find(
                                                      (item) =>
                                                          item.value === value,
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
                            <FieldLabel htmlFor="dialog-frecuencia_dias">
                                Frecuencia de riego (días)
                            </FieldLabel>
                            <Input
                                id="dialog-frecuencia_dias"
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
                            <FieldLabel htmlFor="dialog-fecha_adquisicion">
                                Fecha de adquisición (opcional)
                            </FieldLabel>
                            <Input
                                id="dialog-fecha_adquisicion"
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
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
