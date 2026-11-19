import { router } from 'expo-router';

import { cerrarSesion, leerSesion } from './session';
import type {
  Administrador,
  Campo,
  Catalogo,
  Institucion,
  UsuarioDetalle,
  UsuarioResumen,
  ValorCatalogo,
} from './types';
import type { NewUserEntry, NewUsersQuery, RankingQuery } from '@/src/types/analytics';

import type { EstadisticasRespuesta } from '@/src/types/analytics';

// llamadas al api del portal administrativo

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// error de una petición, con los mensajes listos para mostrar
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly mensajes: string[],
  ) {
    super(mensajes[0]);
  }
}

// mensajes para mostrar a partir de cualquier error atrapado
export function mensajesDe(error: unknown): string[] {
  if (error instanceof ApiError) {
    return error.mensajes;
  }
  console.error(error);
  return ['Ocurrió un error inesperado.'];
}

// mensaje propio cuando el servidor no dio uno pensado para el usuario
function mensajePorDefecto(status: number): string {
  if (status === 401) return 'Tu sesión venció. Inicia sesión de nuevo.';
  if (status === 403) return 'No tienes permiso para hacer esto.';
  if (status === 404) return 'El servidor no encontró lo que se pidió.';
  if (status === 429) return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
  if (status >= 500) return 'Ocurrió un error en el servidor. Inténtalo de nuevo.';
  return 'El servidor rechazó la solicitud.';
}

// solo se muestran los mensajes que el back end escribió en español
async function leerMensajes(respuesta: Response): Promise<string[]> {
  if (respuesta.status < 500) {
    try {
      const cuerpo = (await respuesta.json()) as {
        message?: unknown;
        error?: unknown;
      };
      const lista = Array.isArray(cuerpo.message) ? cuerpo.message : [cuerpo.message];
      const mensajes = lista.filter((m): m is string => typeof m === 'string' && m.length > 0);
      // sin "error" es un texto por defecto de nest; "Cannot GET" es una ruta que no existe
      const esPropio = cuerpo.error !== undefined && !mensajes.some((m) => m.startsWith('Cannot '));
      if (mensajes.length > 0 && esPropio) {
        return mensajes;
      }
    } catch {
      // el cuerpo no es json: se usa el mensaje por defecto
    }
  }
  return [mensajePorDefecto(respuesta.status)];
}

type Opciones = {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  cuerpo?: unknown;
  consulta?: Record<string, string | number | undefined>;
  // la petición no lleva sesión: es la de iniciar sesión
  sinSesion?: boolean;
};

// hace una petición al back end y devuelve su respuesta.  
async function pedir<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, ['Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.']);
  }

  const consulta = new URLSearchParams();
  for (const [clave, valor] of Object.entries(opciones.consulta ?? {})) {
    if (valor !== undefined && valor !== '') {
      consulta.append(clave, String(valor));
    }
  }
  const filtros = consulta.toString();
  const url = `${API_URL}${ruta}${filtros ? `?${filtros}` : ''}`;

  const cabeceras: Record<string, string> = { Accept: 'application/json' };
  const sesion = opciones.sinSesion ? null : leerSesion();
  if (sesion) {
    cabeceras.Authorization = `Bearer ${sesion.token}`;
  }
  if (opciones.cuerpo !== undefined) {
    cabeceras['Content-Type'] = 'application/json';
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      method: opciones.metodo ?? 'GET',
      headers: cabeceras,
      body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(0, [
      'No se pudo conectar con el servidor. Revisa que el back end esté en ejecución e inténtalo de nuevo.',
    ]);
  }

  if (!respuesta.ok) {
    // la sesión venció o se cerró desde otro lugar: hay que volver a entrar.
    // si ya hay otra sesión guardada, esta respuesta es de la anterior y no la toca
    if (respuesta.status === 401 && !opciones.sinSesion && leerSesion()?.token === sesion?.token) {
      cerrarSesion();
      router.replace('/admin/login?vencida=1');
    }
    throw new ApiError(respuesta.status, await leerMensajes(respuesta));
  }
  if (respuesta.status === 204) {
    return undefined as T;
  }
  try {
    return (await respuesta.json()) as T;
  } catch {
    throw new ApiError(0, [
      'La respuesta no vino del back end. Revisa que EXPO_PUBLIC_API_URL apunte al back end (por ejemplo, http://localhost:3000/api).',
    ]);
  }
}

/* ------------------------------ parametros ------------------------------ */

export const listarCatalogos = () => pedir<Catalogo[]>('/admin/catalogs');

// "catalogo" es la clave del catálogo, por ejemplo "metodos-pago"
export const listarValores = (catalogo: string) =>
  pedir<ValorCatalogo[]>(`/admin/catalogs/${catalogo}/values`);

// datos de un parámetro; de los campos propios se envían solo los de su catálogo
export type DatosValor = {
  nombre: string;
  activo: boolean;
} & Partial<Record<Campo, string | number | null>>;

export const crearValor = (catalogo: string, datos: DatosValor) =>
  pedir<ValorCatalogo>(`/admin/catalogs/${catalogo}/values`, {
    metodo: 'POST',
    cuerpo: datos,
  });

export const actualizarValor = (catalogo: string, valorId: number, cambios: Partial<DatosValor>) =>
  pedir<ValorCatalogo>(`/admin/catalogs/${catalogo}/values/${valorId}`, {
    metodo: 'PATCH',
    cuerpo: cambios,
  });

export const borrarValor = (catalogo: string, valorId: number) =>
  pedir<void>(`/admin/catalogs/${catalogo}/values/${valorId}`, {
    metodo: 'DELETE',
  });

/* ----------------------------- instituciones ---------------------------- */

export const listarInstituciones = () => pedir<Institucion[]>('/admin/institutions');

export const crearInstitucion = (datos: {
  nombre: string;
  acronimo: string;
  dominioCorreo: string;
}) => pedir<Institucion>('/admin/institutions', { metodo: 'POST', cuerpo: datos });

export const actualizarInstitucion = (
  id: number,
  cambios: { nombre?: string; acronimo?: string; dominioCorreo?: string; activo?: boolean },
) =>
  pedir<Institucion>(`/admin/institutions/${id}`, {
    metodo: 'PATCH',
    cuerpo: cambios,
  });

/* -------------------------------- usuarios ------------------------------ */

// debe ser igual al valor del back end
export const USUARIOS_POR_PAGINA = 18;

export const listarUsuarios = (filtros: {
  buscar?: string;
  institucionId?: number;
  pagina: number;
}) =>
  pedir<{ datos: UsuarioResumen[]; total: number }>('/admin/users', {
    consulta: filtros,
  });

type RespuestaPuntosConcurrentes = {
  puntos: Array<{
    nombre: string;
    institucionId: number;
    institucion: string;
    viajes: number;
  }>;
  totalPuntosConRegistros: number;
  viajesEnPeriodo: number;
};

export async function consultarPuntosConcurrentes(filtros: {
  desde?: string;
  hasta?: string;
  institucionId?: number;
  top: number;
}): Promise<RankingQuery> {
  const respuesta = await pedir<RespuestaPuntosConcurrentes>(
    '/admin/consultas/puntos-concurrentes',
    { consulta: filtros },
  );
  return {
    entries: respuesta.puntos.map((punto) => ({
      id: punto.nombre,
      name: punto.nombre,
      institution: punto.institucion,
      trips: punto.viajes,
    })),
    totalWithRecords: respuesta.totalPuntosConRegistros,
    tripsInPeriod: respuesta.viajesEnPeriodo,
  };
}

type RespuestaUsuariosNuevos = Omit<NewUsersQuery, 'users'> & {
  users: Array<Omit<NewUserEntry, 'id'> & { id: number }>;
};

export async function consultarUsuariosNuevos(filtros: {
  meses: number;
  institucionId?: number;
  buscar?: string;
}): Promise<NewUsersQuery> {
  const respuesta = await pedir<RespuestaUsuariosNuevos>('/admin/consultas/usuarios-nuevos', {
    consulta: filtros,
  });
  return {
    ...respuesta,
    users: respuesta.users.map((user) => ({ ...user, id: String(user.id) })),
  };
}

export const obtenerUsuario = (id: number) => pedir<UsuarioDetalle>(`/admin/users/${id}`);

export const actualizarUsuario = (
  id: number,
  cambios: {
    nombre?: string;
    apellidos?: string;
    telefono?: string | null;
    activo?: boolean;
  },
) =>
  pedir<void>(`/admin/users/${id}`, {
    metodo: 'PATCH',
    cuerpo: cambios,
  });

/* ---------------------------- administradores --------------------------- */

export const listarAdministradores = () => pedir<Administrador[]>('/admin/administrators');

export const crearAdministrador = (datos: { nombre: string; correo: string; password: string }) =>
  pedir<Administrador>('/admin/administrators', { metodo: 'POST', cuerpo: datos });

// la contraseña solo se envía cuando se quiere cambiar
export const actualizarAdministrador = (
  id: number,
  cambios: { nombre?: string; correo?: string; password?: string; activo?: boolean },
) =>
  pedir<void>(`/admin/administrators/${id}`, {
    metodo: 'PATCH',
    cuerpo: cambios,
  });

/* --------------------------------- sesion ------------------------------- */

// con "recordar" el servidor da una sesión más larga
export const iniciarSesion = (correo: string, password: string, recordar: boolean) =>
  pedir<{ token: string; id: number; nombre: string }>('/admin/auth/login', {
    metodo: 'POST',
    cuerpo: { correo, password, recordar },
    sinSesion: true,
  });

// pide el correo con el enlace para cambiar la contraseña; el servidor responde igual exista o no la cuenta
export const pedirRestablecimiento = (correo: string) =>
  pedir<void>('/admin/auth/password-reset', {
    metodo: 'POST',
    cuerpo: { correo },
    sinSesion: true,
  });

// cambia la contraseña con el token que llegó en el enlace del correo
export const restablecerContrasena = (token: string, password: string) =>
  pedir<void>('/admin/auth/password-reset/confirm', {
    metodo: 'POST',
    cuerpo: { token, password },
    sinSesion: true,
  });

// avisa al servidor para que el token deje de servir
export const cerrarSesionEnServidor = () => pedir<void>('/admin/auth/logout', { metodo: 'POST' });

/* -------------------------- top de conductores -------------------------- */

export type RespuestaTopConductores = {
  conductores: {
    conductorId: number;
    conductor: string;
    institucion: string;
    viajesFinalizados: number;
  }[];
  totalConductores: number;
};

export const consultarTopConductores = (filtros: {
  top: number;
  institucionId?: number;
  buscar?: string;
}) =>
  pedir<RespuestaTopConductores>('/admin/consultas/top-conductores', {
    consulta: filtros,
  });

/* -------------------------- usuarios activos -------------------------- */
export type RespuestaUsuariosActivos = {
  usuarios: {
    usuarioId: number;
    usuario: string;
    institucion: string;
    viajesFinalizados: number;
  }[];
  totalUsuarios: number;
};

export const consultarUsuariosActivos = (filtros: {
  top: number;
  institucionId?: number;
  buscar?: string;
}) =>
  pedir<RespuestaUsuariosActivos>('/admin/consultas/usuarios-activos', {
    consulta: filtros,
  });

/* ------------------------ consulta monto promedio ------------------------ */

// Contrato de GET /api/admin/consultas/monto-promedio del backend.
// Los importes son null cuando no hay viajes con cobro en el período.
export type RespuestaMontoPromedio = {
  viajesEnPeriodo: number;
  viajesConCobro: number;
  viajesSinCobro: number;
  montoPromedio: number | null;
  montoMinimo: number | null;
  montoMaximo: number | null;
  promedioPorInstitucion: {
    institucionId: number;
    institucion: string;
    montoPromedio: number;
    viajesConCobro: number;
  }[];
};

export const consultarMontoPromedio = (filtros: {
  institucionId?: number;
  desde?: string;
  hasta?: string;
}) => pedir<RespuestaMontoPromedio>('/admin/consultas/monto-promedio', { consulta: filtros });


/* --------------------------------- estadisticas ------------------------------- */

export const obtenerEstadisticas = (filtros: { institucionId?: number; desde?: string; hasta?: string }) => 
                                    pedir<EstadisticasRespuesta>('/statistics', { consulta: filtros });

export const consultarViajes = (filtros: {
  institucionId?: number;
  desde?: string;
  hasta?: string;
  buscar?: string;
}) =>
  pedir<TripListEntry[]>('/admin/consultas/viajes', {
    consulta: filtros,
  });
