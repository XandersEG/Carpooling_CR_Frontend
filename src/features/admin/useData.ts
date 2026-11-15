import { useEffect, useState } from 'react';

import { mensajesDe } from './api';

type Estado<T> = { datos?: T; cargando: boolean; errores: string[] };

// carga datos del api y permite volver a pedirlos.  
export function useData<T>(cargar: () => Promise<T>, dependencias: readonly unknown[]) {
  const [estado, setEstado] = useState<Estado<T>>({
    cargando: true,
    errores: [],
  });
  const [vuelta, setVuelta] = useState(0);

  useEffect(() => {
    // una respuesta vieja no debe pisar a una más nueva
    let vigente = true;
    setEstado((previo) => ({ ...previo, cargando: true, errores: [] }));

    cargar().then(
      (datos) => {
        if (vigente) setEstado({ datos, cargando: false, errores: [] });
      },
      (error: unknown) => {
        if (vigente) {
          setEstado((previo) => ({
            ...previo,
            cargando: false,
            errores: mensajesDe(error),
          }));
        }
      },
    );

    return () => {
      vigente = false;
    };
    // "cargar" se crea en cada render; lo que importa son las dependencias
  }, [...dependencias, vuelta]);

  return { ...estado, recargar: () => setVuelta((numero) => numero + 1) };
}
