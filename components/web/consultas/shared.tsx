import { useEffect, useState } from 'react';

import { SelectField } from '@/components/web/controls';
import { FilterItem } from '@/components/web/filters';
import { listarInstituciones, mensajesDe } from '@/src/features/admin/api';
import { listInstitutionFilterOptions } from '@/src/services/admin/analyticsService';
import type { InstitutionCode, InstitutionFilterOption } from '@/src/types/analytics';

export const ALL_INSTITUTIONS = 'Todas las instituciones';

/** Opciones del menú plegable de instituciones. */
export function useInstitutionOptions(
  source: 'mock' | 'admin' = 'mock',
  onError?: (message: string | null) => void,
  activeOnly = false,
): InstitutionFilterOption[] {
  const [options, setOptions] = useState<InstitutionFilterOption[]>([{ label: ALL_INSTITUTIONS, code: null }]);
  useEffect(() => {
    let mounted = true;
    const request =
      source === 'admin'
        ? listarInstituciones().then((institutions) => [
            { label: ALL_INSTITUTIONS, code: null },
            ...institutions
              .filter((institution) => !activeOnly || institution.activo)
              .map((institution) => ({
                label: institution.nombre,
                code: null,
                id: institution.id,
              })),
          ])
        : listInstitutionFilterOptions();
    request.then(
      (list) => {
        if (!mounted) return;
        setOptions(list);
        onError?.(null);
      },
      (reason: unknown) => {
        if (mounted) onError?.(mensajesDe(reason).join(' '));
      },
    );
    return () => {
      mounted = false;
    };
  }, [source, onError, activeOnly]);
  return options;
}

export function institutionCode(options: InstitutionFilterOption[], label: string): InstitutionCode | null {
  return options.find((option) => option.label === label)?.code ?? null;
}

type InstitutionFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: InstitutionFilterOption[];
  label?: string;
};

/** Filtro "Institución" (componente `Instituciones` 2050:1810 + `Menú Plegable`). */
export function InstitutionFilter({ value, onChange, options, label = 'Institución' }: InstitutionFilterProps) {
  return (
    <FilterItem label={label}>
      <SelectField
        value={value}
        options={options.map((option) => option.label)}
        onChange={onChange}
        width={287}
        accessibilityLabel={label}
      />
    </FilterItem>
  );
}
