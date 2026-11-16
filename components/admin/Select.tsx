import { createElement, type ChangeEvent, type CSSProperties } from 'react';

import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

type Props = {
  // lo que lee un lector de pantalla
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  blanco?: boolean;
  ancho?: number | string;
};

// lista desplegable; usa el <select> del navegador
export function Select({
  label,
  value,
  options,
  onChange,
  disabled = false,
  blanco = false,
  ancho = '100%',
}: Props) {
  const { angosta } = useLayout();
  const estilo: CSSProperties = {
    width: ancho,
    // más alta y con letra de 16 px para tocarla con el dedo
    minHeight: angosta ? 44 : 34,
    padding: '6px 10px',
    fontFamily: fuente.normal,
    fontSize: angosta ? 16 : 13,
    color: color.texto,
    backgroundColor: blanco ? color.blanco : color.grisCampo,
    border: `1px solid ${color.linea}`,
    borderRadius: 8,
    opacity: disabled ? 0.7 : 1,
  };

  return createElement(
    'select',
    {
      'aria-label': label,
      value,
      disabled,
      style: estilo,
      onChange: (evento: ChangeEvent<HTMLSelectElement>) => onChange(evento.target.value),
    },
    options.map((opcion) =>
      createElement('option', { key: opcion.value, value: opcion.value }, opcion.label),
    ),
  );
}
