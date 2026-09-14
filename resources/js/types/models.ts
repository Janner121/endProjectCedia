export type Species = {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string | null;
    frecuencia_riego_dias: number;
    luz: 'sol_directo' | 'luz_indirecta' | 'sombra';
    cuidados: string | null;
};

export type EstadoPlanta = 'atrasada' | 'hoy' | 'al_dia';

export type Watering = {
    id: number;
    fecha: string;
    cantidad_ml: number | null;
    fertilizante: boolean;
    observacion: string | null;
};

export type Plant = {
    id: number;
    apodo: string;
    ubicacion: string;
    maceta: 'barro' | 'plastico' | 'suelo';
    frecuencia_dias: number;
    fecha_adquisicion: string | null;
    activa: boolean;
    estado: EstadoPlanta;
    proximo_riego: string | null;
    species: Species;
    waterings?: Watering[];
    created_at: string;
    updated_at: string;
};

export type DashboardData = {
    pendientes_hoy: Plant[];
    atrasadas: Plant[];
    riegos_ultimos_7_dias: number;
    total_por_ubicacion: Record<string, number>;
};
