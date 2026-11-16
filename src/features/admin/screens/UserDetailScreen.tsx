import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Dialog } from '@/components/admin/Dialog';
import { Field } from '@/components/admin/Field';
import { Notice } from '@/components/admin/Notice';
import { PillButton } from '@/components/admin/PillButton';
import { Screen } from '@/components/admin/Screen';
import { StatusPill } from '@/components/admin/StatusPill';
import { useToast } from '@/components/admin/Toast';

import { ApiError, actualizarUsuario, mensajesDe, obtenerUsuario } from '../api';
import { iniciales } from '../session';
import { color, fuente } from '../theme';
import type { UsuarioDetalle } from '../types';
import { useData } from '../useData';
import { useLayout } from '../useLayout';

type Pestana = 'general' | 'actividad' | 'vehiculos';

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: 'general', label: 'Información general' },
  { id: 'actividad', label: 'Actividad' },
  { id: 'vehiculos', label: 'Vehículos' },
];

// fecha corta, como "22 oct 2026"
function aFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// color de la etiqueta según el código del estado del viaje
function colorDeEstado(codigo: string): string {
  if (codigo === 'FINALIZADO') return color.verdeClaro;
  if (codigo === 'CANCELADO') return color.durazno;
  return color.grisChip;
}

type DatoProps = {
  label: string;
  valor: string;
  // tres datos por fila en lugar de dos
  tercio?: boolean;
};

// un dato del usuario: la etiqueta arriba y el valor abajo
function Dato({ label, valor, tercio = false }: DatoProps) {
  const { angosta, celular } = useLayout();
  // en celular los datos van uno por fila, y los de tres por fila van de dos en dos
  const ancho = celular ? (tercio ? styles.datoMitad : styles.datoCompleto) : null;

  return (
    <View style={[styles.dato, tercio ? styles.datoTercio : null, ancho]}>
      <Text style={[styles.etiquetaDato, angosta ? styles.textoLegible : null]}>{label}</Text>
      <Text style={[styles.valorDato, celular ? styles.valorCelular : null]}>{valor}</Text>
    </View>
  );
}

type SeccionProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  // contenido a la derecha del título
  extra?: ReactNode;
  children: ReactNode;
};

// tarjeta con icono y título
function Seccion({ icon, title, extra, children }: SeccionProps) {
  const { celular } = useLayout();

  return (
    <View style={[styles.tarjeta, styles.seccion, celular ? styles.seccionCelular : null]}>
      <View style={styles.tituloSeccion}>
        <Ionicons name={icon} size={20} color={color.texto} />
        <Text style={styles.textoTitulo}>{title}</Text>
        {extra}
      </View>
      {children}
    </View>
  );
}

type PersonalFormProps = { usuario: UsuarioDetalle; onSaved: () => void };

// formulario para editar los datos personales de un usuario.  
function PersonalForm({ usuario, onSaved }: PersonalFormProps) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellidos, setApellidos] = useState(usuario.apellidos);
  const [telefono, setTelefono] = useState(usuario.telefono ?? '');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const { celular } = useLayout();
  const campo = [styles.campo, celular ? styles.datoCompleto : null];

  async function guardar() {
    if (guardando) return;
    setGuardando(true);
    setErrores([]);
    try {
      await actualizarUsuario(usuario.id, {
        nombre,
        apellidos,
        telefono: telefono.trim() === '' ? null : telefono,
      });
      onSaved();
    } catch (error) {
      setErrores(mensajesDe(error));
      setGuardando(false);
    }
  }

  return (
    <>
      <Notice mensajes={errores} />
      <View style={styles.datos}>
        <View style={campo}>
          <Field label="Nombre" value={nombre} onChangeText={setNombre} maxLength={100} />
        </View>
        <View style={campo}>
          <Field label="Apellidos" value={apellidos} onChangeText={setApellidos} maxLength={150} />
        </View>
        <View style={campo}>
          <Field
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            inputMode="tel"
            maxLength={30}
          />
        </View>
        <Dato label="Correo electrónico" valor={usuario.correoInstitucional} />
      </View>
      <View style={[styles.pie, celular ? styles.pieCelular : null]}>
        <PillButton
          label="Guardar cambios"
          icon="checkmark"
          onPress={() => void guardar()}
          ocupado={guardando}
        />
      </View>
    </>
  );
}

// detalle de un usuario: datos, actividad y vehículos.  
export function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const usuarioId = Number(id);
  const {
    datos: usuario,
    cargando,
    errores,
    recargar,
  } = useData(
    () =>
      Number.isInteger(usuarioId)
        ? obtenerUsuario(usuarioId)
        : Promise.reject(new ApiError(404, ['El usuario no existe.'])),
    [usuarioId],
  );
  const [pestana, setPestana] = useState<Pestana>('general');
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const [erroresDeAccion, setErroresDeAccion] = useState<string[]>([]);
  const [toast, mostrarToast] = useToast();
  const { angosta, celular } = useLayout();
  // en pantallas angostas ningún texto baja de 12 px
  const legible = angosta ? styles.textoLegible : null;

  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellidos}` : '';

  // "eliminar" deja al usuario inactivo; después se puede reactivar
  async function cambiarEstado(activo: boolean) {
    if (!usuario || cambiando) return;
    setCambiando(true);
    setErroresDeAccion([]);
    try {
      await actualizarUsuario(usuario.id, { activo });
      mostrarToast(`«${nombreCompleto}» quedó ${activo ? 'activo' : 'inactivo'}`);
      recargar();
    } catch (error) {
      setErroresDeAccion(mensajesDe(error));
    } finally {
      setCambiando(false);
      setConfirmando(false);
    }
  }

  return (
    <Screen title="Gestión > Usuarios > Detalle" subtitle="Uso del servicio" toast={toast}>
      <View style={styles.columna}>
        <Link href="/admin/usuarios" asChild>
          <Pressable
            accessibilityRole="link"
            // link con aschild no acepta una lista de estilos
            style={StyleSheet.flatten([styles.volver, angosta ? styles.zonaTactil : null])}
          >
            <Ionicons name="arrow-back" size={18} color={color.texto} />
            <Text style={[styles.textoVolver, celular ? styles.textoVolverCelular : null]}>
              Volver a usuarios
            </Text>
          </Pressable>
        </Link>

        <Notice mensajes={errores} onRetry={recargar} />
        <Notice mensajes={erroresDeAccion} />
        {cargando && !usuario ? <Text style={styles.vacio}>Cargando…</Text> : null}

        {usuario ? (
          <>
            <View
              style={[styles.tarjeta, styles.encabezado, celular ? styles.encabezadoCelular : null]}
            >
              <View style={[styles.avatar, celular ? styles.avatarCelular : null]}>
                <Text style={[styles.iniciales, celular ? styles.inicialesCelular : null]}>
                  {iniciales(`${usuario.nombre.split(' ')[0]} ${usuario.apellidos}`)}
                </Text>
              </View>
              <View style={styles.identidad}>
                <Text style={[styles.sobretitulo, legible]}>DETALLE DEL USUARIO</Text>
                <Text style={styles.nombre} accessibilityRole="header">
                  {nombreCompleto}
                </Text>
              </View>
              {editando ? (
                <View style={[styles.acciones, celular ? styles.accionesCelular : null]}>
                  {usuario.activo ? (
                    <PillButton
                      label="Desactivar usuario"
                      tono="oscuro"
                      onPress={() => setConfirmando(true)}
                    />
                  ) : (
                    <PillButton
                      label="Reactivar usuario"
                      onPress={() => void cambiarEstado(true)}
                      ocupado={cambiando}
                    />
                  )}
                </View>
              ) : null}
            </View>

            <View
              style={[
                styles.tarjeta,
                styles.pestanas,
                angosta ? styles.pestanasTactiles : null,
                celular ? styles.pestanasCelular : null,
              ]}
              accessibilityRole="tablist"
            >
              {PESTANAS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setPestana(item.id);
                    setEditando(false);
                  }}
                  accessibilityRole="tab"
                  aria-selected={pestana === item.id}
                  style={angosta ? styles.zonaTactil : undefined}
                >
                  <Text style={[styles.pestana, pestana === item.id ? styles.pestanaActual : null]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {pestana === 'general' ? (
              <Seccion icon="person-outline" title="Información personal">
                {editando ? (
                  <PersonalForm
                    usuario={usuario}
                    onSaved={() => {
                      setEditando(false);
                      mostrarToast('Los datos se guardaron correctamente');
                      recargar();
                    }}
                  />
                ) : (
                  <View style={styles.datos}>
                    <Dato label="Nombre completo" valor={nombreCompleto} />
                    <Dato label="Correo electrónico" valor={usuario.correoInstitucional} />
                    <Dato label="Teléfono" valor={usuario.telefono ?? 'Sin registrar'} />
                  </View>
                )}
              </Seccion>
            ) : null}

            {pestana === 'actividad' ? (
              <>
                <View style={[styles.cifras, celular ? styles.cifrasCelular : null]}>
                  {[
                    {
                      label: 'Viajes completados',
                      numero: usuario.actividad.comoConductor + usuario.actividad.comoPasajero,
                    },
                    { label: 'Como conductor', numero: usuario.actividad.comoConductor },
                    { label: 'Como pasajero', numero: usuario.actividad.comoPasajero },
                  ].map((cifra) => (
                    <View
                      key={cifra.label}
                      style={[styles.tarjeta, styles.cifra, celular ? styles.cifraCelular : null]}
                    >
                      <Text style={styles.numero}>{cifra.numero}</Text>
                      <Text style={[styles.etiquetaDato, legible]}>{cifra.label}</Text>
                    </View>
                  ))}
                </View>

                <Seccion icon="pulse-outline" title="Historial de viajes">
                  {celular ? null : (
                    <View style={[styles.viaje, styles.titulosViaje]}>
                      <Text style={[styles.tituloViaje, legible, styles.colFecha]}>Fecha</Text>
                      <Text style={[styles.tituloViaje, legible, styles.colRuta]}>Ruta</Text>
                      <Text style={[styles.tituloViaje, legible, styles.colParticipacion]}>
                        Participación
                      </Text>
                      <Text style={[styles.tituloViaje, legible, styles.colEstado]}>Estado</Text>
                    </View>
                  )}
                  {usuario.actividad.historial.length === 0 ? (
                    <Text style={styles.vacio}>Este usuario todavía no tiene viajes.</Text>
                  ) : null}
                  {celular ? (
                    // en celular cada viaje es un renglón, con la fecha y el estado arriba
                    <View>
                      {usuario.actividad.historial.map((viaje, indice) => (
                        <View key={indice} style={styles.viajeCelular}>
                          <View style={styles.cabeceraViaje}>
                            <Text style={styles.fechaViaje}>{aFecha(viaje.fecha)}</Text>
                            <View
                              style={[
                                styles.estadoViaje,
                                styles.estadoViajeCelular,
                                { backgroundColor: colorDeEstado(viaje.estadoCodigo) },
                              ]}
                            >
                              <Text style={[styles.textoEstadoViaje, styles.textoLegible]}>
                                {viaje.estado}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.rutaViaje}>
                            {viaje.origen} → {viaje.destino}
                          </Text>
                          <Text style={[styles.etiquetaDato, styles.textoLegible]}>
                            {viaje.participacion}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    usuario.actividad.historial.map((viaje, indice) => (
                      <View key={indice} style={styles.viaje}>
                        <Text style={[styles.celdaViaje, styles.colFecha]}>
                          {aFecha(viaje.fecha)}
                        </Text>
                        <Text style={[styles.celdaViaje, styles.colRuta]}>
                          {viaje.origen} → {viaje.destino}
                        </Text>
                        <Text style={[styles.celdaViaje, styles.colParticipacion]}>
                          {viaje.participacion}
                        </Text>
                        <View style={styles.colEstado}>
                          <View
                            style={[
                              styles.estadoViaje,
                              { backgroundColor: colorDeEstado(viaje.estadoCodigo) },
                            ]}
                          >
                            <Text style={[styles.textoEstadoViaje, legible]}>{viaje.estado}</Text>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </Seccion>
              </>
            ) : null}

            {pestana === 'vehiculos' && usuario.vehiculos.length === 0 ? (
              <View style={styles.tarjeta}>
                <Text style={styles.vacio}>Este usuario no tiene vehículos registrados.</Text>
              </View>
            ) : null}
            {pestana === 'vehiculos'
              ? usuario.vehiculos.map((vehiculo) => (
                  <Seccion
                    key={vehiculo.id}
                    icon="car-outline"
                    title="Vehículo registrado"
                    extra={<StatusPill activo={vehiculo.activo} lleno />}
                  >
                    <View style={styles.datos}>
                      <Dato label="Marca" valor={vehiculo.marca} tercio />
                      <Dato label="Modelo" valor={vehiculo.modelo} tercio />
                      <Dato label="Placa" valor={vehiculo.placa} tercio />
                      <Dato label="Color" valor={vehiculo.color} tercio />
                      <Dato
                        label="Espacios para pasajeros"
                        valor={String(vehiculo.capacidadPasajeros)}
                        tercio
                      />
                      {/* espacio vacío para que la segunda fila quede alineada */}
                      <View style={[styles.datoTercio, celular ? styles.datoMitad : null]} />
                    </View>
                  </Seccion>
                ))
              : null}

            <View style={[styles.tarjeta, styles.resumen, celular ? styles.resumenCelular : null]}>
              <Ionicons name="home-outline" size={24} color={color.texto} />
              <View style={styles.datoResumen}>
                <Text style={[styles.etiquetaDato, legible]}>Institución</Text>
                <Text style={[styles.valorResumen, celular ? styles.valorCelular : null]}>
                  {usuario.institucion}
                </Text>
              </View>
              {/* en celular el segundo dato baja de fila y se alinea con el primero */}
              <View style={[styles.datoResumen, celular ? styles.datoBajoIcono : null]}>
                <Text style={[styles.etiquetaDato, legible]}>Estado de la cuenta</Text>
                <Text style={[styles.valorResumen, celular ? styles.valorCelular : null]}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </Text>
              </View>
            </View>

            {pestana === 'general' ? (
              <View style={[styles.pie, celular ? styles.pieCelular : null]}>
                {editando ? (
                  <PillButton
                    label="Salir"
                    tono="oscuro"
                    grande
                    onPress={() => setEditando(false)}
                  />
                ) : (
                  <PillButton
                    label="Editar usuario"
                    icon="pencil-outline"
                    grande
                    onPress={() => setEditando(true)}
                  />
                )}
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      {confirmando ? (
        <Dialog
          title="Atención"
          onClose={() => setConfirmando(false)}
          footer={
            <>
              <PillButton
                label="Aceptar"
                expandido
                onPress={() => void cambiarEstado(false)}
                ocupado={cambiando}
              />
              <PillButton
                label="Cancelar"
                tono="gris"
                expandido
                onPress={() => setConfirmando(false)}
                disabled={cambiando}
              />
            </>
          }
        >
          <Text style={styles.pregunta}>¿Está seguro que desea eliminar a este usuario?</Text>
          <Text style={styles.ayuda}>
            El usuario quedará inactivo. Sus datos y sus viajes se conservan, y se puede reactivar
            después.
          </Text>
        </Dialog>
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
  volver: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoVolver: {
    fontFamily: fuente.negrita,
    fontSize: 12,
    color: color.texto,
  },
  tarjeta: {
    backgroundColor: color.blanco,
    borderRadius: 14,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  avatar: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.verdeClaro,
    borderRadius: 42,
  },
  iniciales: {
    fontFamily: fuente.negrita,
    fontSize: 30,
    color: color.oscuro,
  },
  identidad: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 200,
    gap: 4,
  },
  sobretitulo: {
    fontFamily: fuente.media,
    fontSize: 9,
    letterSpacing: 0.5,
    color: color.malva,
  },
  nombre: {
    fontFamily: fuente.negrita,
    fontSize: 17,
    color: color.texto,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pestanas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 30,
    rowGap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  pestana: {
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.textoSuave,
  },
  pestanaActual: {
    fontFamily: fuente.negrita,
    color: color.texto,
  },
  seccion: {
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  tituloSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoTitulo: {
    flex: 1,
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.texto,
  },
  datos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  dato: {
    width: '47%',
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.linea,
  },
  datoTercio: {
    width: '30%',
  },
  campo: {
    width: '47%',
  },
  etiquetaDato: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.malva,
  },
  valorDato: {
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
  cifras: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  cifra: {
    flexGrow: 1,
    flexBasis: 180,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  numero: {
    fontFamily: fuente.negrita,
    fontSize: 28,
    lineHeight: 34,
    color: color.oscuro,
  },
  viaje: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.linea,
  },
  titulosViaje: {
    backgroundColor: color.banda,
    borderBottomWidth: 0,
  },
  tituloViaje: {
    fontFamily: fuente.negrita,
    fontSize: 11,
    color: color.texto,
  },
  celdaViaje: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  colFecha: {
    width: 100,
  },
  colRuta: {
    flex: 1,
  },
  colParticipacion: {
    width: 110,
  },
  colEstado: {
    width: 120,
  },
  estadoViaje: {
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  textoEstadoViaje: {
    fontFamily: fuente.negrita,
    fontSize: 11,
    color: color.texto,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  datoResumen: {
    flexGrow: 1,
    flexBasis: 200,
    gap: 8,
  },
  valorResumen: {
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.texto,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  vacio: {
    padding: 24,
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.textoSuave,
    textAlign: 'center',
  },
  pregunta: {
    fontFamily: fuente.negrita,
    fontSize: 14,
    lineHeight: 22,
    color: color.texto,
  },
  ayuda: {
    fontFamily: fuente.normal,
    fontSize: 12,
    lineHeight: 18,
    color: color.textoSuave,
  },
  // zona de 44 px para tocar con el dedo un enlace o una pestaña
  zonaTactil: {
    minHeight: 44,
    justifyContent: 'center',
  },
  // en pantallas angostas ningún texto baja de 12 px
  textoLegible: {
    fontSize: 12,
  },
  textoVolverCelular: {
    fontSize: 13,
  },
  encabezadoCelular: {
    gap: 16,
    paddingHorizontal: 16,
  },
  avatarCelular: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  inicialesCelular: {
    fontSize: 24,
  },
  accionesCelular: {
    flexBasis: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  pestanasTactiles: {
    paddingVertical: 2,
  },
  pestanasCelular: {
    justifyContent: 'space-between',
    columnGap: 8,
    paddingHorizontal: 16,
  },
  seccionCelular: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  datoCompleto: {
    width: '100%',
  },
  datoMitad: {
    width: '47%',
  },
  valorCelular: {
    fontSize: 14,
  },
  cifrasCelular: {
    flexWrap: 'nowrap',
    gap: 10,
  },
  cifraCelular: {
    flexBasis: 0,
    paddingHorizontal: 12,
  },
  viajeCelular: {
    gap: 2,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: color.linea,
  },
  cabeceraViaje: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  fechaViaje: {
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.texto,
  },
  estadoViajeCelular: {
    minWidth: 96,
  },
  rutaViaje: {
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.texto,
  },
  resumenCelular: {
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  // el ancho del icono más el espacio que lo separa del primer dato
  datoBajoIcono: {
    marginLeft: 40,
  },
  pieCelular: {
    flexDirection: 'column',
  },
});
