import type { EstadoPlanta } from '@/types/models';

export const estadoLabel: Record<EstadoPlanta, string> = {
    atrasada: 'Atrasada',
    hoy: 'Hoy',
    al_dia: 'Al día',
};

export const estadoClass: Record<EstadoPlanta, string> = {
    atrasada: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    hoy: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    al_dia: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
};
