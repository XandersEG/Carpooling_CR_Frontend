import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Dialog } from '@/components/admin/Dialog';
import { Field } from '@/components/admin/Field';
import { Notice } from '@/components/admin/Notice';
import { PillButton } from '@/components/admin/PillButton';
import { Screen } from '@/components/admin/Screen';
import { Select } from '@/components/admin/Select';
import { StatusPill } from '@/components/admin/StatusPill';
import { useToast } from '@/components/admin/Toast';

import {
  actualizarValor,
  borrarValor,
  crearValor,
  listarCatalogos,
  listarValores,
  mensajesDe,
  type DatosValor,
} from '../api';
import { color, fuente } from '../theme';
import type { Campo, Catalogo, ValorCatalogo } from '../types';
import { useData } from '../useData';

const ESTADOS = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activos', label: 'Activos' },
  { value: 'inactivos', label: 'Inactivos' },
];

type Textos = {
  // cómo se llama un valor del catálogo: "método de pago"
  singular: string;
  femenino?: boolean;
  // título de la columna del nombre
  columna: string;
  // etiqueta y ejemplo del campo del nombre
  etiqueta: string;
  ejemplo?: string;
};

// textos del prototipo para cada catálogo, según su clave
const TEXTOS: Record<string, Textos> = {
  'metodos-pago': {
    singular: 'método de pago',
    columna: 'MÉTODO DE PAGO',
    etiqueta: 'Nombre',
    ejemplo: 'Ej: SINPE Móvil',
  },
  'tipos-vehiculo': {
    singular: 'tipo de vehículo',
    columna: 'TIPO DE VEHÍCULO',
    etiqueta: 'Nombre',
    ejemplo: 'Ej: Sedán',
  },
  'rangos-edad': {
    singular: 'rango de edad',
    columna: 'RANGO DE EDAD',
    etiqueta: 'Nombre del rango',
    ejemplo: 'Ej: 18 a 24 años',
  },
  'opciones-genero': {
    singular: 'opción de género',
    femenino: true,
    columna: 'OPCIÓN',
    etiqueta: 'Nombre de la opción',
    ejemplo: 'Ej: No binario',
  },
  'reglas-tarifas': {
    singular: 'regla',
    femenino: true,
    columna: 'REGLA',
    etiqueta: 'Nombre de la regla',
    ejemplo: 'Ej: Tarifa máxima por kilómetro',
  },
};

// textos para un catálogo que el portal todavía no conoce
const TEXTOS_GENERALES: Textos = {
  singular: 'parámetro',
  columna: 'NOMBRE',
  etiqueta: 'Nombre del parámetro',
};

function textosDe(catalogo?: Catalogo): Textos {
  return (catalogo && TEXTOS[catalogo.clave]) || TEXTOS_GENERALES;
}

function plural(cantidad: number | undefined, uno: string, varios: string): string {
  return `${cantidad} ${cantidad === 1 ? uno : varios}`;
}

// junta el valor con su unidad: "₡150 por km" o "30 minutos"
function textoValor({ valor, unidad }: ValorCatalogo): string {
  if (valor == null) return '';
  const numero = Number(valor).toLocaleString('es-CR', { maximumFractionDigits: 6 });
  return unidad?.startsWith('₡')
    ? `₡${numero}${unidad.slice(1)}`
    : `${numero} ${unidad ?? ''}`.trim();
}

type Numero = 'entero' | 'decimal';

type Definicion = {
  etiqueta: string;
  ejemplo?: string;
  // los campos numéricos solo aceptan números
  numero?: Numero;
  largo: number;
  // texto de la celda en la tabla; sin él, el campo no tiene columna propia
  celda?: (valor: ValorCatalogo) => string;
};

// campos propios de los catálogos: cómo se piden en el diálogo y cómo se ven en la tabla
const CAMPOS: Record<Campo, Definicion> = {
  descripcion: {
    etiqueta: 'Descripción',
    largo: 255,
    celda: (valor) => valor.descripcion ?? '',
  },
  capacidadMaxima: {
    etiqueta: 'Capacidad máxima',
    ejemplo: 'Ej: 4',
    numero: 'entero',
    largo: 3,
    celda: (valor) => plural(valor.capacidadMaxima, 'pasajero', 'pasajeros'),
  },
  edadMinima: {
    etiqueta: 'Edad mínima',
    ejemplo: 'Ej: 18',
    numero: 'entero',
    largo: 3,
    celda: (valor) => plural(valor.edadMinima, 'año', 'años'),
  },
  edadMaxima: {
    etiqueta: 'Edad máxima',
    ejemplo: 'Ej: 24',
    numero: 'entero',
    largo: 3,
    celda: (valor) => plural(valor.edadMaxima, 'año', 'años'),
  },
  valor: {
    etiqueta: 'Valor',
    ejemplo: 'Ej: 150',
    numero: 'decimal',
    largo: 10,
    celda: textoValor,
  },
  // la unidad no tiene columna: se muestra junto al valor
  unidad: { etiqueta: 'Unidad', ejemplo: 'Ej: minutos', largo: 50 },
};

// texto en minúsculas y sin tildes, para comparar al buscar
function aPlano(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// lo que trae cada campo propio al abrir el diálogo
function camposIniciales(valor?: ValorCatalogo): Record<Campo, string> {
  return {
    descripcion: valor?.descripcion ?? '',
    capacidadMaxima: valor?.capacidadMaxima?.toString() ?? '',
    edadMinima: valor?.edadMinima?.toString() ?? '',
    edadMaxima: valor?.edadMaxima?.toString() ?? '',
    // sin ceros de más: "150.000000" queda como "150"
    valor: valor?.valor == null ? '' : String(Number(valor.valor)),
    unidad: valor?.unidad ?? '',
  };
}

// deja solo lo que el campo acepta: dígitos, y un punto si es decimal
function limpiar(texto: string, numero?: Numero): string {
  if (numero === 'entero') return texto.replace(/\D/g, '');
  if (numero === 'decimal') {
    const [entero, ...decimales] = texto
      .replace(',', '.')
      .replace(/[^\d.]/g, '')
      .split('.');
    return decimales.length > 0 ? `${entero}.${decimales.join('')}` : entero;
  }
  return texto;
}

// convierte lo escrito en el dato que espera el api; un número sin escribir va vacío
function aDato(texto: string, numero?: Numero): string | number | null {
  if (!numero) return texto;
  return texto === '' || texto === '.' ? null : Number(texto);
}

type InterruptorProps = { activo: boolean; onChange: (activo: boolean) => void };

// interruptor de activo o inactivo
function Interruptor({ activo, onChange }: InterruptorProps) {
  return (
    <Pressable
      onPress={() => onChange(!activo)}
      accessibilityRole="switch"
      accessibilityLabel="Estado"
      aria-checked={activo}
      style={[styles.interruptor, activo ? styles.interruptorActivo : null]}
    >
      <View style={[styles.perilla, activo ? styles.perillaActiva : null]} />
    </Pressable>
  );
}

type ParameterDialogProps = {
  catalogos: Catalogo[];
  // clave del catálogo que se está viendo en la pantalla
  clave: string;
  // parámetro a editar; sin él, el diálogo crea uno nuevo
  valor?: ValorCatalogo;
  onClose: () => void;
  onSaved: (clave: string, mensaje: string) => void;
};

// diálogo para agregar o editar un parámetro; pide los campos del catálogo elegido.  
function ParameterDialog({ catalogos, clave, valor, onClose, onSaved }: ParameterDialogProps) {
  const [elegida, setElegida] = useState(clave);
  const [nombre, setNombre] = useState(valor?.nombre ?? '');
  const [propios, setPropios] = useState(() => camposIniciales(valor));
  const [activo, setActivo] = useState(valor?.activo ?? true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const catalogo = catalogos.find((item) => item.clave === elegida);
  const campos = catalogo?.campos ?? [];
  const textos = textosDe(catalogo);

  async function guardar() {
    if (guardando) return;
    setGuardando(true);
    setErrores([]);
    try {
      const datos: DatosValor = { nombre, activo };
      for (const campo of campos) {
        datos[campo] = aDato(propios[campo], CAMPOS[campo].numero);
      }
      if (valor) {
        await actualizarValor(elegida, valor.id, datos);
        onSaved(elegida, `«${nombre.trim()}» se actualizó correctamente`);
      } else {
        await crearValor(elegida, datos);
        onSaved(elegida, `«${nombre.trim()}» se agregó correctamente`);
      }
    } catch (error) {
      setErrores(mensajesDe(error));
      setGuardando(false);
    }
  }

  return (
    <Dialog
      title={
        valor
          ? `Editar ${textos.singular}: ${valor.nombre ?? ''}`
          : `${textos.femenino ? 'Nueva' : 'Nuevo'} ${textos.singular}`
      }
      onClose={onClose}
      errores={errores}
      footer={
        <>
          <PillButton label="Cancelar" tono="gris" onPress={onClose} disabled={guardando} />
          <PillButton
            label={valor ? 'Guardar cambios' : 'Agregar'}
            onPress={() => void guardar()}
            ocupado={guardando}
          />
        </>
      }
    >
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Catálogo</Text>
        <Select
          label="Catálogo"
          value={elegida}
          options={catalogos.map((item) => ({ value: item.clave, label: item.nombre }))}
          onChange={(otra) => {
            setElegida(otra);
            setErrores([]);
          }}
          // un parámetro que ya existe no se pasa a otro catálogo
          disabled={valor !== undefined}
        />
      </View>
      <Field
        label={textos.etiqueta}
        value={nombre}
        onChangeText={setNombre}
        placeholder={textos.ejemplo}
        maxLength={100}
        autoFocus
      />
      {campos.length > 0 ? (
        <View style={styles.propios}>
          {campos.map((campo) => {
            const definicion = CAMPOS[campo];
            return (
              // los campos cortos van de dos en dos; la descripción ocupa toda la fila
              <View key={campo} style={definicion.largo > 50 ? styles.completo : styles.medio}>
                <Field
                  label={definicion.etiqueta}
                  value={propios[campo]}
                  onChangeText={(texto) =>
                    setPropios({ ...propios, [campo]: limpiar(texto, definicion.numero) })
                  }
                  placeholder={definicion.ejemplo}
                  inputMode={
                    definicion.numero === 'entero'
                      ? 'numeric'
                      : definicion.numero === 'decimal'
                        ? 'decimal'
                        : 'text'
                  }
                  maxLength={definicion.largo}
                />
              </View>
            );
          })}
        </View>
      ) : null}
      <View style={styles.estado}>
        <View style={styles.textosEstado}>
          <Text style={styles.etiqueta}>Estado</Text>
          <Text style={styles.ayuda}>
            Si está inactivo, no aparecerá como opción en la app ni en el portal.
          </Text>
        </View>
        <Interruptor activo={activo} onChange={setActivo} />
      </View>
    </Dialog>
  );
}

type DeleteDialogProps = {
  catalogo: Catalogo;
  valor: ValorCatalogo;
  onClose: () => void;
  onDeleted: (mensaje: string) => void;
};

// confirmación antes de eliminar un parámetro.  
function DeleteDialog({ catalogo, valor, onClose, onDeleted }: DeleteDialogProps) {
  const [borrando, setBorrando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  async function borrar() {
    if (borrando) return;
    setBorrando(true);
    setErrores([]);
    try {
      await borrarValor(catalogo.clave, valor.id);
      onDeleted(`«${valor.nombre ?? ''}» se eliminó correctamente`);
    } catch (error) {
      setErrores(mensajesDe(error));
      setBorrando(false);
    }
  }

  return (
    <Dialog
      title={`Eliminar ${textosDe(catalogo).singular}`}
      icon="trash-outline"
      onClose={onClose}
      errores={errores}
      footer={
        <>
          <PillButton label="Cancelar" tono="gris" onPress={onClose} disabled={borrando} />
          <PillButton
            label="Eliminar"
            tono="terracota"
            onPress={() => void borrar()}
            ocupado={borrando}
          />
        </>
      }
    >
      <Text style={styles.pregunta}>
        ¿Seguro que deseas eliminar «{valor.nombre ?? ''}» del catálogo de {catalogo.nombre}?
      </Text>
      <Text style={styles.ayuda}>
        Esta acción no se puede deshacer. Si solo quieres ocultarlo, puedes desactivarlo desde
        Editar.
      </Text>
    </Dialog>
  );
}

type Dialogo =
  { tipo: 'guardar'; valor?: ValorCatalogo } | { tipo: 'borrar'; valor: ValorCatalogo };

// sección de parámetros: los cinco catálogos y los valores de cada uno.  
export function ParametersScreen() {
  const catalogos = useData(listarCatalogos, []);
  const [elegida, setElegida] = useState<string | null>(null);
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('todos');
  const [dialogo, setDialogo] = useState<Dialogo | null>(null);
  const [toast, mostrarToast] = useToast();

  const lista = catalogos.datos ?? [];
  // mientras no se elija otro, se muestra el primer catálogo
  const catalogo = lista.find((item) => item.clave === elegida) ?? lista.at(0);
  const clave = catalogo?.clave;
  // los valores se guardan con la clave de su catálogo para no mostrarlos en otro
  const valores = useData(
    async () => (clave ? { clave, lista: await listarValores(clave) } : null),
    [clave],
  );

  const delCatalogo = valores.datos && valores.datos.clave === clave ? valores.datos.lista : [];
  const filas = delCatalogo.filter(
    (valor) =>
      aPlano(valor.nombre ?? '').includes(aPlano(buscar)) &&
      (estado === 'todos' || valor.activo === (estado === 'activos')),
  );
  const textos = textosDe(catalogo);
  // campos del catálogo que tienen columna en la tabla
  const columnas = (catalogo?.campos ?? []).filter((campo) => CAMPOS[campo].celda);

  // texto de la tabla cuando no hay filas que mostrar
  function textoSinFilas(): string | null {
    if (!catalogo) {
      if (catalogos.cargando) return 'Cargando…';
      return catalogos.errores.length > 0 ? null : 'Todavía no hay catálogos.';
    }
    if (delCatalogo.length === 0) {
      if (valores.errores.length > 0) return null;
      // mientras no lleguen los valores de este catálogo, todavía está cargando
      if (valores.cargando || valores.datos?.clave !== clave) return 'Cargando…';
      return 'Este catálogo todavía no tiene parámetros. Agrega el primero con «Nuevo Parámetro».';
    }
    return filas.length === 0 ? 'Ningún parámetro coincide con el filtro.' : null;
  }

  function alTerminar(mensaje: string) {
    setDialogo(null);
    mostrarToast(mensaje);
    catalogos.recargar();
    valores.recargar();
  }

  const sinFilas = textoSinFilas();

  return (
    <Screen
      title="Gestión de Parámetros"
      subtitle="Administra los catálogos de opciones que se muestran en la app móvil y el portal web."
      toast={toast}
      action={
        <PillButton
          label="Nuevo Parámetro"
          icon="add-circle-outline"
          grande
          onPress={() => setDialogo({ tipo: 'guardar' })}
          disabled={!catalogo}
        />
      }
    >
      <View style={styles.columna}>
        <Notice mensajes={catalogos.errores} onRetry={catalogos.recargar} />

        <View style={[styles.tarjeta, styles.catalogos]}>
          <View style={styles.chips} accessibilityRole="tablist">
            {lista.map((item) => {
              const actual = item.clave === clave;
              return (
                <Pressable
                  key={item.clave}
                  onPress={() => setElegida(item.clave)}
                  accessibilityRole="tab"
                  aria-selected={actual}
                  style={[styles.chip, actual ? styles.chipActual : null]}
                >
                  <Ionicons name="wallet-outline" size={18} color={color.texto} />
                  <Text style={styles.textoChip}>{item.nombre}</Text>
                  <View style={styles.cuenta}>
                    <Text style={styles.textoCuenta}>{item.total}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.buscador}>
            <Ionicons name="search-outline" size={16} color={color.textoSuave} />
            <TextInput
              value={buscar}
              onChangeText={setBuscar}
              placeholder="Buscar parámetro..."
              placeholderTextColor={color.textoSuave}
              accessibilityLabel="Buscar parámetro"
              style={styles.entradaBuscar}
            />
          </View>
        </View>

        <Notice mensajes={valores.errores} onRetry={valores.recargar} />

        <View style={[styles.tarjeta, styles.tabla]}>
          <View style={styles.cabecera}>
            <View style={styles.punto} />
            <Text style={styles.tituloTabla} accessibilityRole="header">
              {catalogo ? `Catálogo de ${catalogo.nombre}` : 'Catálogos'}
            </Text>
            <Select
              label="Filtrar por estado"
              value={estado}
              options={ESTADOS}
              onChange={setEstado}
              ancho={180}
            />
          </View>

          <View style={[styles.fila, styles.titulos]}>
            <Text style={[styles.titulo, styles.colNombre]}>{textos.columna}</Text>
            {columnas.map((campo) => (
              <Text
                key={campo}
                style={[
                  styles.titulo,
                  campo === 'descripcion' ? styles.colAncha : styles.colPropia,
                ]}
              >
                {CAMPOS[campo].etiqueta.toUpperCase()}
              </Text>
            ))}
            <Text style={[styles.titulo, styles.colEstado]}>ESTADO</Text>
            <Text style={[styles.titulo, styles.colAcciones]}>ACCIONES</Text>
          </View>

          {sinFilas ? <Text style={styles.vacio}>{sinFilas}</Text> : null}
          {filas.map((valor) => (
            <View key={valor.id} style={styles.fila}>
              <Text style={[styles.nombre, styles.colNombre]}>{valor.nombre}</Text>
              {columnas.map((campo) => (
                <Text
                  key={campo}
                  style={[
                    styles.celda,
                    campo === 'descripcion' ? styles.colAncha : styles.colPropia,
                  ]}
                >
                  {CAMPOS[campo].celda?.(valor)}
                </Text>
              ))}
              <View style={styles.colEstado}>
                <StatusPill activo={valor.activo} />
              </View>
              <View style={[styles.colAcciones, styles.acciones]}>
                <Pressable
                  onPress={() => setDialogo({ tipo: 'guardar', valor })}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${valor.nombre ?? ''}`}
                >
                  <Ionicons name="create-outline" size={21} color={color.texto} />
                </Pressable>
                <Pressable
                  onPress={() => setDialogo({ tipo: 'borrar', valor })}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${valor.nombre ?? ''}`}
                >
                  <Ionicons name="trash-outline" size={21} color={color.texto} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>

      {dialogo?.tipo === 'guardar' && catalogo ? (
        <ParameterDialog
          catalogos={lista}
          clave={catalogo.clave}
          valor={dialogo.valor}
          onClose={() => setDialogo(null)}
          onSaved={(guardada, mensaje) => {
            setElegida(guardada);
            alTerminar(mensaje);
          }}
        />
      ) : null}
      {dialogo?.tipo === 'borrar' && catalogo ? (
        <DeleteDialog
          catalogo={catalogo}
          valor={dialogo.valor}
          onClose={() => setDialogo(null)}
          onDeleted={alTerminar}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  columna: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    gap: 14,
  },
  tarjeta: {
    backgroundColor: color.blanco,
    borderRadius: 18,
    overflow: 'hidden',
  },
  catalogos: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: 22,
  },
  chips: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: color.grisChip,
    borderRadius: 999,
  },
  chipActual: {
    backgroundColor: color.verde,
  },
  textoChip: {
    maxWidth: 68,
    fontFamily: fuente.media,
    fontSize: 12,
    lineHeight: 16,
    color: color.texto,
  },
  cuenta: {
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: color.oscuro,
    borderRadius: 11,
  },
  textoCuenta: {
    fontFamily: fuente.negrita,
    fontSize: 11,
    color: color.blanco,
  },
  buscador: {
    width: 190,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: color.grisCampo,
    borderWidth: 1,
    borderColor: color.linea,
    borderRadius: 999,
  },
  entradaBuscar: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
  tabla: {
    minHeight: 380,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  punto: {
    width: 12,
    height: 12,
    backgroundColor: color.verde,
    borderRadius: 6,
  },
  tituloTabla: {
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: fuente.negrita,
    fontSize: 14,
    color: color.texto,
  },
  fila: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: color.linea,
  },
  titulos: {
    backgroundColor: color.banda,
    borderTopWidth: 1,
    borderTopColor: color.linea,
  },
  titulo: {
    fontFamily: fuente.media,
    fontSize: 11,
    color: color.texto,
  },
  colNombre: {
    flex: 2,
  },
  colPropia: {
    flex: 1,
  },
  colAncha: {
    flex: 2,
  },
  colEstado: {
    width: 110,
    alignItems: 'flex-start',
  },
  colAcciones: {
    width: 76,
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  nombre: {
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.texto,
  },
  celda: {
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
  vacio: {
    padding: 28,
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.textoSuave,
    textAlign: 'center',
  },
  campo: {
    gap: 4,
  },
  etiqueta: {
    fontFamily: fuente.negrita,
    fontSize: 12,
    color: color.texto,
  },
  propios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 12,
  },
  medio: {
    flexGrow: 1,
    flexBasis: 150,
  },
  completo: {
    flexBasis: '100%',
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.verdeClaro,
    borderWidth: 1,
    borderColor: color.verdeSuave,
    borderRadius: 8,
  },
  textosEstado: {
    flex: 1,
    gap: 2,
  },
  ayuda: {
    fontFamily: fuente.normal,
    fontSize: 12,
    lineHeight: 18,
    color: color.textoSuave,
  },
  pregunta: {
    fontFamily: fuente.negrita,
    fontSize: 14,
    lineHeight: 22,
    color: color.texto,
  },
  interruptor: {
    width: 44,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 3,
    backgroundColor: color.gris,
    borderRadius: 12,
  },
  interruptorActivo: {
    backgroundColor: color.verde,
  },
  perilla: {
    width: 18,
    height: 18,
    backgroundColor: color.blanco,
    borderRadius: 9,
  },
  perillaActiva: {
    alignSelf: 'flex-end',
  },
});
