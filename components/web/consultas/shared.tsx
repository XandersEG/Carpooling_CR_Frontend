import { useEffect, useState } from 'react';

import { SelectField } from '@/components/web/controls';
import { FilterItem } from '@/components/web/filters';
import { listInstitutionFilterOptions } from '@/src/services/admin/analyticsService';
import type { InstitutionCode, InstitutionFilterOption } from '@/src/types/analytics';

export const ALL_INSTITUTIONS = 'Todas las instituciones';

/** Opciones del menú plegable de instituciones. */
export function useInstitutionOptions(): InstitutionFilterOption[] {
  const [options, setOptions] = useState<InstitutionFilterOption[]>([{ label: ALL_INSTITUTIONS, code: null }]);
  useEffect(() => {
    let mounted = true;
    listInstitutionFilterOptions().then((list) => mounted && setOptions(list));
    return () => {
      mounted = false;
    };
  }, []);
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
