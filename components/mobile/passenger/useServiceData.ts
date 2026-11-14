import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

type ServiceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Carga datos de un servicio (simulado o real) para una pantalla.
 * Con `reloadOnFocus` vuelve a cargar cada vez que la pantalla recibe el foco
 * (p. ej. "Mis Viajes" después de solicitar un viaje).
 */
export function useServiceData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  { reloadOnFocus = false }: { reloadOnFocus?: boolean } = {},
): ServiceState<T> {
  const [state, setState] = useState<ServiceState<T>>({ data: null, loading: true, error: null });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const load = useCallback(() => {
    let active = true;
    setState((current) => ({ ...current, loading: current.data === null, error: null }));
    loaderRef
      .current()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'No se pudo cargar la información.',
          });
        }
      });
    return () => {
      active = false;
    };
    // Las dependencias las define quien llama (como en useEffect); el loader se lee de la ref.
  }, deps);

  useEffect(() => {
    if (!reloadOnFocus) return load();
    return undefined;
  }, [load, reloadOnFocus]);

  useFocusEffect(
    useCallback(() => {
      if (reloadOnFocus) return load();
      return undefined;
    }, [load, reloadOnFocus]),
  );

  return state;
}
