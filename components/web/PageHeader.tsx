import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Título del encabezado del portal. Un arreglo se muestra como migas de pan
 * ("Gestión > Usuarios"), con el último segmento en negrita (Cairo Black).
 */
export type AdminHeaderConfig = {
  title: string | string[];
  subtitle?: string;
  /** Acciones a la izquierda de la campana (p. ej. "Nuevo Parámetro"). Memorizar con useMemo. */
  actions?: ReactNode;
};

type AdminHeaderContextValue = {
  header: AdminHeaderConfig;
  setHeader: (config: AdminHeaderConfig) => void;
};

const EMPTY_HEADER: AdminHeaderConfig = { title: '' };

const AdminHeaderContext = createContext<AdminHeaderContextValue>({
  header: EMPTY_HEADER,
  setHeader: () => undefined,
});

export function AdminHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<AdminHeaderConfig>(EMPTY_HEADER);
  return <AdminHeaderContext.Provider value={{ header, setHeader }}>{children}</AdminHeaderContext.Provider>;
}

export function useAdminHeaderState(): AdminHeaderConfig {
  return useContext(AdminHeaderContext).header;
}

/** Cada página del portal define su título, subtítulo y acciones del encabezado. */
export function useAdminHeader({ title, subtitle, actions }: AdminHeaderConfig) {
  const { setHeader } = useContext(AdminHeaderContext);
  const titleKey = Array.isArray(title) ? title.join('\u0000') : title;

  useEffect(() => {
    setHeader({ title, subtitle, actions });
    // `title` se compara por su clave de texto para no depender de la identidad del arreglo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleKey, subtitle, actions, setHeader]);
}
