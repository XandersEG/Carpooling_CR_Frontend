// datos que devuelve el api del portal; usan los mismos nombres que las tablas

// campos propios de cada catálogo, además de nombre y activo
export type Campo =
  'descripcion' | 'capacidadMaxima' | 'edadMinima' | 'edadMaxima' | 'valor' | 'unidad';

export type Catalogo = {
  // identifica al catálogo en las rutas del api, por ejemplo "metodos-pago"
  clave: string;
  nombre: string;
  campos: Campo[];
  total: number;
};

// valor de un catálogo; cada catálogo trae solo sus campos
export type ValorCatalogo = {
  id: number;
  nombre: string | null;
  activo: boolean;
  descripcion?: string | null;
  capacidadMaxima?: number;
  edadMinima?: number;
  edadMaxima?: number;
  // los decimales llegan como texto
  valor?: string | null;
  unidad?: string | null;
};

export type Institucion = {
  id: number;
  nombre: string;
  // es opcional: una institución puede no tenerlo
  acronimo: string | null;
  dominioCorreo: string;
  activo: boolean;
};

export type Administrador = {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
};

export type UsuarioResumen = {
  id: number;
  nombre: string;
  apellidos: string;
  activo: boolean;
};

export type Vehiculo = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  capacidadPasajeros: number;
  activo: boolean;
};

export type ViajeDelHistorial = {
  fecha: string;
  origen: string;
  destino: string;
  estado: string;
  estadoCodigo: string;
  participacion: string;
};

export type UsuarioDetalle = {
  id: number;
  nombre: string;
  apellidos: string;
  correoInstitucional: string;
  telefono: string | null;
  activo: boolean;
  institucion: string;
  vehiculos: Vehiculo[];
  actividad: {
    comoConductor: number;
    comoPasajero: number;
    historial: ViajeDelHistorial[];
  };
};
