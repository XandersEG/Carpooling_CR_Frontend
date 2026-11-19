#!/usr/bin/env node
/**
 * Limpia un SVG exportado desde Figma para usarlo con react-native-svg.
 *
 * - Elimina atributos que solo aplican en web (style, overflow, preserveAspectRatio).
 * - Opcionalmente reemplaza colores por `currentColor` para poder teñir el ícono
 *   con la prop `color` del componente.
 *
 * Uso:
 *   node scripts/prepare-svg.mjs <entrada.svg> <salida.svg> [--tint "#1C1C1C" --tint black ...]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error('Uso: node scripts/prepare-svg.mjs <entrada.svg> <salida.svg> [--tint <color> ...]');
  process.exit(1);
}

const tints = [];
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i] === '--tint' && rest[i + 1]) tints.push(rest[(i += 1)]);
}

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let svg = readFileSync(input, 'utf8');
svg = svg.replace(/\s(preserveAspectRatio|overflow|style)="[^"]*"/g, '');
for (const color of tints) {
  svg = svg.replace(new RegExp(`(fill|stroke)="${escape(color)}"`, 'gi'), '$1="currentColor"');
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, svg, 'utf8');
console.log(`${output}${tints.length ? ` (currentColor: ${tints.join(', ')})` : ''}`);
