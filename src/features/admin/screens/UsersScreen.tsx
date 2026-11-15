import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  USUARIOS_POR_PAGINA,
  actualizarAdministrador,
  crearAdministrador,
  listarAdministradores,
  listarInstituciones,
  listarUsuarios,
  mensajesDe,
} from '../api';
import { color, fuente } from '../theme';
import type { Administrador } from '../types';
import { useData } from '../useData';

// tiempo que se espera sin escribir antes de buscar
const ESPERA_MS = 300;

type AdministratorDialogProps = {
  // administrador a editar; sin él, el diálogo registra uno nuevo
  administrador?: Administrador;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
};

// diálogo para registrar o editar un administrador: pide los datos de la tabla de administradores.  
function AdministratorDialog({ administrador, onClose, onSaved }: AdministratorDialogProps) {
  const [nombre, setNombre] = useState(administrador?.nombre ?? '');
  const [correo, setCorreo] = useState(administrador?.correo ?? '');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  async function guardar() {
    if (guardando) return;
    // la contraseña se escribe dos veces porque después no se puede consultar
    if (password !== confirmacion) {
      setErrores(['Las contraseñas no coinciden.']);
      return;
    }
    setGuardando(true);
    setErrores([]);
    try {
      if (administrador) {
        // al editar, la contraseña solo cambia si se escribe una nueva
        await actualizarAdministrador(administrador.id, {
          nombre,
          correo,
          ...(password === '' ? {} : { password }),
        });
        onSaved(`«${nombre.trim()}» se actualizó correctamente`);
      } else {
        await crearAdministrador({ nombre, correo, password });
        onSaved(`«${nombre.trim()}» se registró como administrador`);
      }
    } catch (error) {
      setErrores(mensajesDe(error));
      setGuardando(false);
    }
  }

  return (
    <Dialog
      title={administrador ? 'Editar administrador' : 'Registrar administrador'}
      icon={administrador ? 'create-outline' : 'person-add-outline'}
      onClose={onClose}
      errores={errores}
      footer={
        <>
          <PillButton label="Cancelar" tono="gris" onPress={onClose} disabled={guardando} />
          <PillButton
            label={administrador ? 'Guardar cambios' : 'Registrar'}
            onPress={() => void guardar()}
            ocupado={guardando}
          />
        </>
      }
    >
      <Field label="Nombre" value={nombre} onChangeText={setNombre} maxLength={100} autoFocus />
      <Field
        label="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        placeholder="Ej: nombre@institucion.ac.cr"
        autoCapitalize="none"
        autoComplete="off"
        inputMode="email"
        maxLength={255}
      />
      <Field
        label={administrador ? 'Nueva contraseña' : 'Contraseña'}
        value={password}
        onChangeText={setPassword}
        placeholder={administrador ? 'Déjala vacía para no cambiarla' : 'Mínimo 8 caracteres'}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        maxLength={128}
      />
      <Field
        label={administrador ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
        value={confirmacion}
        onChangeText={setConfirmacion}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        maxLength={128}
      />
    </Dialog>
  );
}

type AdministratorsAreaProps = {
  // avisa a la pantalla que una acción salió bien
  onSaved: (mensaje: string) => void;
};

// área de administradores: la lista, el registro, la edición y activar o desactivar.  
function AdministratorsArea({ onSaved }: AdministratorsAreaProps) {
  const { datos, cargando, errores, recargar } = useData(listarAdministradores, []);
  const [dialogo, setDialogo] = useState<{ administrador?: Administrador } | null>(null);
  // id del administrador que se está activando o desactivando
  const [cambiando, setCambiando] = useState<number | null>(null);
  const [erroresDeAccion, setErroresDeAccion] = useState<string[]>([]);
  const administradores = datos ?? [];

  async function cambiarEstado(administrador: Administrador) {
    if (cambiando !== null) return;
    setCambiando(administrador.id);
    setErroresDeAccion([]);
    try {
      await actualizarAdministrador(administrador.id, { activo: !administrador.activo });
      onSaved(
        `«${administrador.nombre}» se ${administrador.activo ? 'desactivó' : 'activó'} correctamente`,
      );
      recargar();
    } catch (error) {
      setErroresDeAccion(mensajesDe(error));
    } finally {
      setCambiando(null);
    }
  }

  return (
    <View style={styles.administradores}>
      <View style={styles.encabezado}>
        <Text style={styles.subtitulo} accessibilityRole="header">
          Administradores
        </Text>
        <PillButton
          label="Registrar administrador"
          tono="oscuro"
          icon="person-add-outline"
          onPress={() => setDialogo({})}
        />
      </View>

      <Notice mensajes={errores} onRetry={recargar} />
      <Notice mensajes={erroresDeAccion} />

      <View style={styles.tabla}>
        <View style={styles.fila}>
          <Text style={[styles.titulo, styles.colNombre]}>Nombre</Text>
          <View style={styles.colCorreo}>
            <Text style={styles.titulo}>Correo</Text>
          </View>
          <View style={styles.colFija}>
            <Text style={styles.titulo}>Estado</Text>
          </View>
          <View style={styles.colAcciones}>
            <Text style={styles.titulo}>Acciones</Text>
          </View>
        </View>

        {cargando && datos === undefined ? <Text style={styles.vacio}>Cargando…</Text> : null}
        {datos !== undefined && administradores.length === 0 ? (
          <Text style={styles.vacio}>Todavía no hay administradores registrados.</Text>
        ) : null}
        {administradores.map((administrador) => (
          <View key={administrador.id} style={styles.fila}>
            <Text style={[styles.celda, styles.colNombre]} numberOfLines={1}>
              {administrador.nombre}
            </Text>
            <View style={styles.colCorreo}>
              <Text style={styles.celda} numberOfLines={1}>
                {administrador.correo}
              </Text>
            </View>
            <View style={styles.colFija}>
              <StatusPill activo={administrador.activo} lleno />
            </View>
            <View style={styles.colAcciones}>
              <PillButton
                label="Editar"
                tono="malva"
                pequeno
                onPress={() => setDialogo({ administrador })}
              />
              <PillButton
                label={administrador.activo ? 'Desactivar' : 'Activar'}
                tono={administrador.activo ? 'terracota' : 'verde'}
                pequeno
                onPress={() => void cambiarEstado(administrador)}
                ocupado={cambiando === administrador.id}
              />
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.total}>
        {datos !== undefined
          ? `${administradores.length} ${administradores.length === 1 ? 'administrador' : 'administradores'}`
          : ''}
      </Text>

      {dialogo ? (
        <AdministratorDialog
          administrador={dialogo.administrador}
          onClose={() => setDialogo(null)}
          onSaved={(mensaje) => {
            setDialogo(null);
            onSaved(mensaje);
            recargar();
          }}
        />
      ) : null}
    </View>
  );
}

// sección de usuarios: listado con búsqueda y filtros, y el área de administradores.  
export function UsersScreen() {
  const router = useRouter();
  const [buscar, setBuscar] = useState('');
  // texto que ya se envió al servidor
  const [busqueda, setBusqueda] = useState('');
  const [institucionId, setInstitucionId] = useState('');
  const [pagina, setPagina] = useState(1);
  const [toast, mostrarToast] = useToast();

  useEffect(() => {
    const reloj = setTimeout(() => {
      setBusqueda(buscar.trim());
      setPagina(1);
    }, ESPERA_MS);
    return () => clearTimeout(reloj);
  }, [buscar]);

  const instituciones = useData(listarInstituciones, []);
  const usuarios = useData(
    () =>
      listarUsuarios({
        buscar: busqueda,
        institucionId: institucionId ? Number(institucionId) : undefined,
        pagina,
      }),
    [busqueda, institucionId, pagina],
  );

  const filas = usuarios.datos?.datos ?? [];
  const total = usuarios.datos?.total ?? 0;
  const paginas = Math.max(1, Math.ceil(total / USUARIOS_POR_PAGINA));
  const conFiltros = busqueda !== '' || institucionId !== '';

  return (
    <Screen title="Gestión > Usuarios" subtitle="Uso del servicio" toast={toast}>
      <View style={styles.columna}>
        <View style={styles.buscador}>
          <Ionicons name="search-outline" size={18} color={color.texto} />
          <TextInput
            value={buscar}
            onChangeText={setBuscar}
            placeholder="Buscar"
            placeholderTextColor={color.textoSuave}
            accessibilityLabel="Buscar usuario por nombre o correo"
            maxLength={100}
            style={styles.entradaBuscar}
          />
        </View>

        <Select
          label="Filtrar por institución"
          value={institucionId}
          options={[
            { value: '', label: 'Todas las instituciones' },
            ...(instituciones.datos ?? []).map((institucion) => ({
              value: String(institucion.id),
              label: institucion.nombre,
            })),
          ]}
          onChange={(id) => {
            setInstitucionId(id);
            setPagina(1);
          }}
          blanco
          ancho={250}
        />

        <Notice mensajes={instituciones.errores} onRetry={instituciones.recargar} />
        <Notice mensajes={usuarios.errores} onRetry={usuarios.recargar} />

        <View style={styles.tabla}>
          <View style={styles.fila}>
            <Text style={[styles.titulo, styles.colNombre]}>Nombre</Text>
            <View style={styles.colFija}>
              <Text style={styles.titulo}>Detalle</Text>
            </View>
            <View style={styles.colFija}>
              <Text style={styles.titulo}>Estado</Text>
            </View>
          </View>

          {usuarios.cargando && usuarios.datos === undefined ? (
            <Text style={styles.vacio}>Cargando…</Text>
          ) : null}
          {usuarios.datos !== undefined && filas.length === 0 ? (
            <Text style={styles.vacio}>
              {conFiltros
                ? 'Ningún usuario coincide con la búsqueda.'
                : 'Todavía no hay usuarios registrados.'}
            </Text>
          ) : null}
          {filas.map((usuario) => (
            <View key={usuario.id} style={styles.fila}>
              <Text style={[styles.celda, styles.colNombre]} numberOfLines={1}>
                {usuario.nombre} {usuario.apellidos}
              </Text>
              <View style={styles.colFija}>
                <PillButton
                  label="Ver detalle"
                  tono="malva"
                  pequeno
                  onPress={() => router.push(`/admin/usuarios/${usuario.id}`)}
                />
              </View>
              <View style={styles.colFija}>
                <StatusPill activo={usuario.activo} lleno />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pie}>
          <Text style={styles.total}>
            {usuarios.datos !== undefined
              ? `${total} ${total === 1 ? 'usuario' : 'usuarios'} · Página ${pagina} de ${paginas}`
              : ''}
          </Text>
          <View style={styles.paginador}>
            <Pressable
              onPress={() => setPagina(pagina - 1)}
              disabled={pagina <= 1}
              accessibilityRole="button"
              accessibilityLabel="Página anterior"
              style={[styles.flecha, pagina <= 1 ? styles.flechaApagada : null]}
            >
              <Ionicons name="chevron-back" size={18} color={color.texto} />
            </Pressable>
            <Pressable
              onPress={() => setPagina(pagina + 1)}
              disabled={pagina >= paginas}
              accessibilityRole="button"
              accessibilityLabel="Página siguiente"
              style={[styles.flecha, pagina >= paginas ? styles.flechaApagada : null]}
            >
              <Ionicons name="chevron-forward" size={18} color={color.texto} />
            </Pressable>
          </View>
        </View>

        <AdministratorsArea onSaved={mostrarToast} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  columna: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: 8,
  },
  buscador: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: color.blanco,
    borderRadius: 999,
  },
  entradaBuscar: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
    fontFamily: fuente.media,
    fontSize: 13,
    color: color.texto,
  },
  tabla: {
    backgroundColor: color.blanco,
    borderTopWidth: 1,
    borderTopColor: color.grisOscuro,
  },
  fila: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: color.grisOscuro,
  },
  titulo: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  colNombre: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  colFija: {
    width: 136,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderLeftWidth: 1,
    borderLeftColor: color.grisOscuro,
  },
  celda: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  vacio: {
    padding: 28,
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.textoSuave,
    textAlign: 'center',
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  total: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  paginador: {
    flexDirection: 'row',
    gap: 1,
  },
  flecha: {
    width: 66,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.blanco,
  },
  flechaApagada: {
    opacity: 0.45,
  },
  administradores: {
    gap: 8,
    marginTop: 28,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  subtitulo: {
    fontFamily: fuente.negrita,
    fontSize: 16,
    color: color.oscuro,
  },
  colCorreo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderLeftColor: color.grisOscuro,
  },
  colAcciones: {
    width: 184,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 3,
    borderLeftWidth: 1,
    borderLeftColor: color.grisOscuro,
  },
});
