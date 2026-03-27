export interface AlmacenInterface {
    id?: number;
    nombre: string;
    codigo?: string;
    descripcion?: string;
    sucursal_id: number | null;
}