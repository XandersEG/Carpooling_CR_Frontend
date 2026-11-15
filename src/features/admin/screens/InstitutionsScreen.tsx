import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Dialog } from '@/components/admin/Dialog';
import { Field } from '@/components/admin/Field';
import { Notice } from '@/components/admin/Notice';
import { PillButton } from '@/components/admin/PillButton';
import { Screen } from '@/components/admin/Screen';
import { useToast } from '@/components/admin/Toast';

import { actualizarInstitucion, crearInstitucion, listarInstituciones, mensajesDe } from '../api';
import { color, fuente } from '../theme';
import type { Institucion } from '../types';
import { useData } from '../useData';

type DialogProps = {
  // institución a editar; sin ella el diálogo agrega una nueva
  institucion?: Institucion;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
};

// diálogo para agregar o editar una institución.  
function InstitutionDialog({ institucion, onClose, onSaved }: DialogProps) {
  const [nombre, setNombre] = useState(institucion?.nombre ?? '');
  const [dominio, setDominio] = useState(institucion?.dominioCorreo ?? '');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  async function guardar() {
    if (guardando) return;
    setGuardando(true);
    setErrores([]);
    try {
      const datos = { nombre, dominioCorreo: dominio };
      if (institucion) {
        await actualizarInstitucion(institucion.id, datos);
        onSaved(`«${nombre.trim()}» se actualizó correctamente`);
      } else {
        await crearInstitucion(datos);
        onSaved(`«${nombre.trim()}» se agregó correctamente`);
      }
    } catch (error) {
      setErrores(mensajesDe(error));
      setGuardando(false);
    }
  }

  return (
    <Dialog
      title={institucion ? 'Editar' : 'Agregar Institución'}
      onClose={onClose}
      errores={errores}
      footer={
        <>
          <PillButton label="Cancelar" tono="gris" onPress={onClose} disabled={guardando} />
          <PillButton
            label={institucion ? 'Guardar' : 'Agregar'}
            onPress={() => void guardar()}
            ocupado={guardando}
          />
        </>
      }
    >
      <Field label="Nombre" value={nombre} onChangeText={setNombre} maxLength={150} autoFocus />
      <Field
        label="Dominio de correo"
        value={dominio}
        onChangeText={setDominio}
        placeholder="Ej: itcr.ac.cr"
        autoCapitalize="none"
        maxLength={150}
      />
    </Dialog>
  );
}

// sección de instituciones: lista, alta y edición.  
export function InstitutionsScreen() {
  const { datos, cargando, errores, recargar } = useData(listarInstituciones, []);
  const [dialogo, setDialogo] = useState<{ institucion?: Institucion } | null>(null);
  // id de la institución que se está activando o desactivando
  const [cambiando, setCambiando] = useState<number | null>(null);
  const [erroresDeAccion, setErroresDeAccion] = useState<string[]>([]);
  const [toast, mostrarToast] = useToast();

  async function cambiarEstado(institucion: Institucion) {
    if (cambiando !== null) return;
    setCambiando(institucion.id);
    setErroresDeAccion([]);
    try {
      await actualizarInstitucion(institucion.id, { activo: !institucion.activo });
      mostrarToast(
        `«${institucion.nombre}» se ${institucion.activo ? 'desactivó' : 'activó'} correctamente`,
      );
      recargar();
    } catch (error) {
      setErroresDeAccion(mensajesDe(error));
    } finally {
      setCambiando(null);
    }
  }

  const instituciones = datos ?? [];

  return (
    <Screen
      title="Gestión > Instituciones"
      subtitle="Configuración de instituciones afiliadas al servicio."
      toast={toast}
    >
      <View style={[styles.tarjeta, styles.titulos]}>
        <Text style={[styles.titulo, styles.columna]}>Nombre Institución</Text>
        <Text style={[styles.titulo, styles.columna, styles.separado]}>Dominio de correo</Text>
        <View style={[styles.acciones, styles.separado]}>
          <PillButton
            label="Agregar Institución"
            tono="oscuro"
            icon="add-circle-outline"
            onPress={() => setDialogo({})}
          />
        </View>
      </View>

      <Notice mensajes={errores} onRetry={recargar} />
      <Notice mensajes={erroresDeAccion} />

      <View style={[styles.tarjeta, styles.lista]}>
        {cargando && datos === undefined ? <Text style={styles.vacio}>Cargando…</Text> : null}
        {datos !== undefined && instituciones.length === 0 ? (
          <Text style={styles.vacio}>
            Todavía no hay instituciones. Agrega la primera con «Agregar Institución».
          </Text>
        ) : null}
        {instituciones.map((institucion, indice) => (
          <View
            key={institucion.id}
            style={[
              styles.fila,
              indice % 2 === 1 ? styles.filaAlterna : null,
              institucion.activo ? null : styles.filaInactiva,
            ]}
          >
            <Text style={[styles.celda, styles.columna]}>{institucion.nombre}</Text>
            <Text style={[styles.celda, styles.columna]}>{institucion.dominioCorreo}</Text>
            <View style={styles.acciones}>
              <PillButton
                label="Editar"
                tono={institucion.activo ? 'verde' : 'oscuro'}
                onPress={() => setDialogo({ institucion })}
              />
              <PillButton
                label={institucion.activo ? 'Desactivar' : 'Activar'}
                tono={institucion.activo ? 'terracota' : 'verde'}
                onPress={() => void cambiarEstado(institucion)}
                ocupado={cambiando === institucion.id}
              />
            </View>
          </View>
        ))}
        {datos !== undefined ? (
          <Text style={styles.total}>
            {instituciones.length} {instituciones.length === 1 ? 'institución' : 'instituciones'}
          </Text>
        ) : null}
      </View>

      {dialogo ? (
        <InstitutionDialog
          institucion={dialogo.institucion}
          onClose={() => setDialogo(null)}
          onSaved={(mensaje) => {
            setDialogo(null);
            mostrarToast(mensaje);
            recargar();
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: color.blanco,
    borderRadius: 18,
    overflow: 'hidden',
  },
  titulos: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  titulo: {
    paddingVertical: 4,
    fontFamily: fuente.negrita,
    fontSize: 15,
    color: color.texto,
    textAlign: 'center',
  },
  separado: {
    borderLeftWidth: 1,
    borderLeftColor: color.grisOscuro,
  },
  columna: {
    flex: 1,
    minWidth: 140,
  },
  acciones: {
    width: 230,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  lista: {
    minHeight: 320,
  },
  fila: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.linea,
  },
  filaAlterna: {
    backgroundColor: color.banda,
  },
  filaInactiva: {
    backgroundColor: color.durazno,
  },
  celda: {
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.texto,
  },
  vacio: {
    padding: 28,
    fontFamily: fuente.normal,
    fontSize: 14,
    color: color.textoSuave,
    textAlign: 'center',
  },
  total: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.textoSuave,
  },
});
