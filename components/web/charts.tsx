import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { fonts, palette, webColors } from '@/src/constants/theme';

/**
 * Gráficos del portal dibujados con react-native-svg (sin librerías de gráficos).
 * Las etiquetas se renderizan con <Text> de RN para usar la fuente Cairo. Los
 * anchos se expresan en porcentajes para no depender de medir el contenedor.
 */

// ── Dona ─────────────────────────────────────────────────────────────────────

export type DonutSegment = { key: string; value: number; color: string };

type DonutChartProps = {
  segments: DonutSegment[];
  size: number;
  thickness: number;
  /** Número central y texto debajo ("25" / "Personas"). */
  centerValue: string;
  centerLabel: string;
  valueFontSize?: number;
  labelFontSize?: number;
};

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, outer: number, inner: number, start: number, end: number): string {
  const large = end - start > Math.PI ? 1 : 0;
  const p1 = polar(cx, cy, outer, start);
  const p2 = polar(cx, cy, outer, end);
  const p3 = polar(cx, cy, inner, end);
  const p4 = polar(cx, cy, inner, start);
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outer} ${outer} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

/** Dona de Estadísticas: los segmentos inician abajo (6 en punto) y avanzan en sentido horario. */
export function DonutChart({
  segments,
  size,
  thickness,
  centerValue,
  centerLabel,
  valueFontSize = 32,
  labelFontSize = 18,
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = size / 2;
  let angle = Math.PI / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {total === 0 ? (
          <Circle cx={radius} cy={radius} r={radius - thickness / 2} stroke={palette.greyLight} strokeWidth={thickness} fill="none" />
        ) : (
          segments.map((segment) => {
            const sweep = (segment.value / total) * Math.PI * 2;
            const start = angle;
            angle += sweep;
            if (sweep >= Math.PI * 2 - 1e-6) {
              return (
                <Circle
                  key={segment.key}
                  cx={radius}
                  cy={radius}
                  r={radius - thickness / 2}
                  stroke={segment.color}
                  strokeWidth={thickness}
                  fill="none"
                />
              );
            }
            return (
              <Path key={segment.key} d={arcPath(radius, radius, radius, radius - thickness, start, start + sweep)} fill={segment.color} />
            );
          })
        )}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.donutCenter]}>
        <Text style={[styles.donutValue, { fontSize: valueFontSize, lineHeight: valueFontSize * 1.3 }]}>{centerValue}</Text>
        <Text style={[styles.donutLabel, { fontSize: labelFontSize }]}>{centerLabel}</Text>
      </View>
    </View>
  );
}

// ── Barras verticales ────────────────────────────────────────────────────────

export type BarDatum = { key: string; label: string; value: number };

const AXIS_WIDTH = 58;
const BAR_RADIUS = 8;
/** Proporción del ancho de cada columna que ocupa la barra (130 px de 157 en el diseño). */
const BAR_WIDTH_RATIO = '84%';
const BAR_MAX_WIDTH = 130;

/**
 * Barra con esquinas superiores redondeadas: un rectángulo redondeado más uno
 * recto que cubre las esquinas inferiores.
 */
function Bar({ height, color }: { height: number; color: string }) {
  if (height <= 0) return null;
  const radius = Math.min(BAR_RADIUS, height);
  return (
    <View style={styles.barBox}>
      <Svg width="100%" height={height}>
        <Rect x={0} y={0} width="100%" height={height} rx={radius} ry={radius} fill={color} />
        <Rect x={0} y={height / 2} width="100%" height={height / 2} fill={color} />
      </Svg>
    </View>
  );
}

type ValueBarChartProps = {
  data: BarDatum[];
  /** Valor máximo del eje y separación de las marcas. */
  max: number;
  step: number;
  height: number;
  color: string;
  formatValue: (value: number) => string;
  /** Contenido del tooltip al pasar el cursor por una barra (`Promedio1–4`). */
  renderTooltip: (datum: BarDatum) => ReactNode;
};

/** Barras con eje y líneas guía (Monto promedio, "Promedio por institución"). */
export function ValueBarChart({ data, max, step, height, color, formatValue, renderTooltip }: ValueBarChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, index) => index * step);
  const y = (value: number) => height - (Math.min(value, max) / max) * height;

  return (
    <View>
      <View style={{ height }}>
        {ticks.map((tick) => (
          <Text key={tick} style={[styles.axisLabel, { top: y(tick) - 12 }]}>
            {formatValue(tick)}
          </Text>
        ))}
        <View style={[styles.plot, { left: AXIS_WIDTH }]}>
          <Svg width="100%" height={height} style={StyleSheet.absoluteFill}>
            {ticks.map((tick) => (
              <Line key={tick} x1="0" x2="100%" y1={y(tick)} y2={y(tick)} stroke={palette.greyLight} strokeWidth={1} />
            ))}
          </Svg>
          <View style={styles.columns}>
            {data.map((datum) => (
              <Pressable
                key={datum.key}
                accessibilityLabel={`${datum.label}: ${formatValue(datum.value)}`}
                onHoverIn={() => setHovered(datum.key)}
                onHoverOut={() => setHovered((current) => (current === datum.key ? null : current))}
                onPress={() => setHovered((current) => (current === datum.key ? null : datum.key))}
                style={styles.column}
              >
                <Text style={styles.barValueSmall}>{formatValue(datum.value)}</Text>
                <Bar height={height - y(datum.value)} color={color} />
                {hovered === datum.key ? (
                  <View style={[styles.tooltip, { bottom: height - y(datum.value) + 18 }]}>{renderTooltip(datum)}</View>
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.xLabels, { marginLeft: AXIS_WIDTH }]}>
        {data.map((datum) => (
          <Text key={datum.key} style={[styles.xLabel, styles.flex]}>
            {datum.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

type CountBarChartProps = {
  data: BarDatum[];
  height: number;
  color: string;
};

/** Barras simples con el valor encima (Usuarios nuevos por mes). */
export function CountBarChart({ data, height, color }: CountBarChartProps) {
  const max = Math.max(1, ...data.map((datum) => datum.value));
  const plot = height - 34;

  return (
    <View>
      <View style={[styles.columns, styles.countPlot, { height }]}>
        {data.map((datum) => (
          <View key={datum.key} style={styles.column}>
            <Text style={styles.countValue}>{datum.value}</Text>
            <Bar height={(datum.value / max) * plot} color={color} />
          </View>
        ))}
      </View>
      <View style={styles.xLabels}>
        {data.map((datum) => (
          <Text key={datum.key} style={[styles.monthLabel, styles.flex]}>
            {datum.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Barras horizontales (Usuarios por rango de edad) ────────────────────────

type HorizontalBarsProps = {
  data: BarDatum[];
  color: string;
  barHeight?: number;
};

/** La barra más larga ocupa el 75 % del ancho disponible, como en el diseño. */
const HORIZONTAL_MAX_RATIO = 75;

export function HorizontalBars({ data, color, barHeight = 28 }: HorizontalBarsProps) {
  const max = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <View>
      {data.map((datum, index) => (
        <View key={datum.key} style={[styles.hRow, index > 0 && styles.hDivider]}>
          <Text style={styles.hLabel}>{datum.label}</Text>
          <View style={styles.flex}>
            <Svg width="100%" height={barHeight}>
              <Rect
                x={0}
                y={0}
                width={`${Math.max(5, (datum.value / max) * HORIZONTAL_MAX_RATIO)}%`}
                height={barHeight}
                rx={6}
                ry={6}
                fill={color}
              />
            </Svg>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  donutCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutValue: {
    fontFamily: fonts.cairoBold,
    color: palette.nearBlack,
  },
  donutLabel: {
    fontFamily: fonts.cairoRegular,
    color: webColors.headerText,
    marginTop: -6,
  },
  axisLabel: {
    position: 'absolute',
    left: 0,
    width: AXIS_WIDTH - 10,
    textAlign: 'right',
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: webColors.headerText,
  },
  plot: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barBox: {
    width: BAR_WIDTH_RATIO,
    maxWidth: BAR_MAX_WIDTH,
  },
  countPlot: {
    borderBottomWidth: 1,
    borderBottomColor: palette.greyLight,
  },
  barValueSmall: {
    fontFamily: fonts.cairoRegular,
    fontSize: 10,
    color: palette.grey,
  },
  tooltip: {
    position: 'absolute',
    zIndex: 5,
  },
  xLabels: {
    flexDirection: 'row',
    marginTop: 4,
  },
  xLabel: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: webColors.headerText,
  },
  countValue: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 20,
    color: webColors.headerText,
    marginBottom: 4,
  },
  monthLabel: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 22,
    color: webColors.headerText,
  },
  hRow: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  hDivider: {
    borderTopWidth: 1,
    borderTopColor: palette.greyLight,
  },
  hLabel: {
    width: 134,
    textAlign: 'right',
    fontFamily: fonts.cairoRegular,
    fontSize: 20,
    color: webColors.headerText,
  },
});
