// sesión del administrador en el portal web

export type AdminSession = { token: string; nombre: string };

const CLAVE = 'tuanis.admin';

// primera pantalla del portal para quien ya tiene sesión
export const INICIO_DEL_PORTAL = '/admin/instituciones';

// copia en memoria: es la que queda si el navegador no deja guardar nada
let enMemoria: AdminSession | null = null;

type Almacen = 'localStorage' | 'sessionStorage';

// almacén del navegador, o null si no existe o está bloqueado
function almacen(nombre: Almacen): Storage | null {
  try {
    return (typeof window === 'undefined' ? null : window[nombre]) ?? null;
  } catch {
    return null;
  }
}

// lo guardado pudo cambiarse a mano: sirve solo si tiene la forma de una sesión
function esSesion(valor: unknown): valor is AdminSession {
  const sesion = valor as AdminSession | null;
  return typeof sesion?.token === 'string' && typeof sesion.nombre === 'string';
}

function leerGuardada(nombre: Almacen): AdminSession | null {
  try {
    const sesion: unknown = JSON.parse(almacen(nombre)?.getItem(CLAVE) ?? 'null');
    return esSesion(sesion) ? sesion : null;
  } catch {
    return null;
  }
}

// sesión actual, o null si no hay.  
export function leerSesion(): AdminSession | null {
  return leerGuardada('localStorage') ?? leerGuardada('sessionStorage') ?? enMemoria;
}

// guarda la sesión; con "recordar" sobrevive a cerrar el navegador.  
export function guardarSesion(sesion: AdminSession, recordar: boolean): void {
  // una sesión anterior no debe quedar guardada en el otro almacén
  cerrarSesion();
  enMemoria = sesion;
  try {
    almacen(recordar ? 'localStorage' : 'sessionStorage')?.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // el navegador no dejó guardar: la sesión dura hasta recargar la página
  }
}

// borra la sesión de este navegador
export function cerrarSesion(): void {
  enMemoria = null;
  for (const nombre of ['localStorage', 'sessionStorage'] as const) {
    try {
      almacen(nombre)?.removeItem(CLAVE);
    } catch {
      // almacén bloqueado: no hay nada que borrar
    }
  }
}

// iniciales para el avatar: "Diego Araya" da "DA"
export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}
