import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Dialog } from '@/components/admin/Dialog';
import { Field } from '@/components/admin/Field';
import { Notice } from '@/components/admin/Notice';
import { PillButton } from '@/components/admin/PillButton';
import { Screen } from '@/components/admin/Screen';
import { StatusPill } from '@/components/admin/StatusPill';
import { useToast } from '@/components/admin/Toast';

import { actualizarInstitucion, crearInstitucion, listarInstituciones, mensajesDe } from '../api';
import { color, fuente } from '../theme';
import type { Institucion } from '../types';
import { useData } from '../useData';
import { useLayout } from '../useLayout';

// texto que se muestra en una institución que todavía no tiene acrónimo
const SIN_ACRONIMO = 'Sin registrar';

type DialogProps = {
  // institución a editar; sin ella el diálogo agrega una nueva
  institucion?: Institucion;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
};

// diálogo para agregar o editar una institución.  
function InstitutionDialog({ institucion, onClose, onSaved }: DialogProps) {
  const [nombre, setNombre] = useState(institucion?.nombre ?? '');
  const [acronimo, setAcronimo] = useState(institucion?.acronimo ?? '');
  const [dominio, setDominio] = useState(institucion?.dominioCorreo ?? '');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  async function guardar() {
    if (guardando) return;
    setGuardando(true);
    setErrores([]);
    try {
      const datos = { nombre, acronimo, dominioCorreo: dominio };
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
      title={institucion ? 'Editar' : 'Agregar institución'}
      onClose={onClose}
      errores={errores}
      footer={
        <>
          <PillButton
            label="Cancelar"
            tono="gris"
            expandido
            onPress={onClose}
            disabled={guardando}
          />
          <PillButton
            label={institucion ? 'Guardar' : 'Agregar'}
            expandido
            onPress={() => void guardar()}
            ocupado={guardando}
          />
        </>
      }
    >
      <Field label="Nombre" value={nombre} onChangeText={setNombre} maxLength={150} autoFocus />
      <Field
        label="Acrónimo"
        value={acronimo}
        onChangeText={setAcronimo}
        placeholder="Ej: TEC"
        autoCapitalize="characters"
        maxLength={10}
        style={acronimo ? styles.mayusculas : null}
      />
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

// sección de instituciones: lista, alta y edición. en celular cada institución es una tarjeta.  
export function InstitutionsScreen() {
  const { celular } = useLayout();
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
  // texto que ocupa el lugar de la lista mientras carga o si está vacía
  const aviso =
    datos === undefined
      ? cargando
        ? 'Cargando…'
        : null
      : instituciones.length === 0
        ? 'Todavía no hay instituciones. Agrega la primera con «Agregar institución».'
        : null;
  const total = (
    <>
      {instituciones.length} {instituciones.length === 1 ? 'institución' : 'instituciones'}
    </>
  );

  const agregar = (
    <PillButton
      label="Agregar institución"
      tono="oscuro"
      icon="add-circle-outline"
      onPress={() => setDialogo({})}
    />
  );

  // botones de una institución; en celular se reparten el ancho de la tarjeta
  const acciones = (institucion: Institucion) => (
    <>
      <PillButton
        label="Editar"
        tono={institucion.activo ? 'verde' : 'oscuro'}
        expandido
        onPress={() => setDialogo({ institucion })}
      />
      <PillButton
        label={institucion.activo ? 'Desactivar' : 'Activar'}
        tono={institucion.activo ? 'terracota' : 'verde'}
        expandido
        onPress={() => void cambiarEstado(institucion)}
        ocupado={cambiando === institucion.id}
      />
    </>
  );

  return (
    <Screen
      title="Gestión > Instituciones"
      subtitle="Configuración de instituciones afiliadas al servicio."
      toast={toast}
    >
      {celular ? (
        agregar
      ) : (
        <View style={[styles.tarjeta, styles.titulos]}>
          <Text style={[styles.titulo, styles.columna]}>Nombre de institución</Text>
          <Text style={[styles.titulo, styles.columnaCorta, styles.separado]}>Acrónimo</Text>
          <Text style={[styles.titulo, styles.columna, styles.separado]}>Dominio de correo</Text>
          <View style={[styles.acciones, styles.separado]}>{agregar}</View>
        </View>
      )}

      <Notice mensajes={errores} onRetry={recargar} />
      <Notice mensajes={erroresDeAccion} />

      {celular ? (
        <>
          {aviso ? (
            <View style={styles.tarjeta}>
              <Text style={styles.vacio}>{aviso}</Text>
            </View>
          ) : null}
          {instituciones.map((institucion) => (
            <View
              key={institucion.id}
              style={[
                styles.tarjeta,
                styles.ficha,
                institucion.activo ? null : styles.filaInactiva,
              ]}
            >
              <View style={styles.cabeceraFicha}>
                <Text style={styles.nombreFicha}>{institucion.nombre}</Text>
                <StatusPill activo={institucion.activo} />
              </View>
              <View>
                <Text
                  style={[styles.etiqueta, institucion.activo ? null : styles.etiquetaInactiva]}
                >
                  Acrónimo
                </Text>
                <Text style={[styles.celda, institucion.acronimo ? null : styles.sinDato]}>
                  {institucion.acronimo || SIN_ACRONIMO}
                </Text>
              </View>
              <View>
                <Text
                  style={[styles.etiqueta, institucion.activo ? null : styles.etiquetaInactiva]}
                >
                  Dominio de correo
                </Text>
                <Text style={styles.celda}>{institucion.dominioCorreo}</Text>
              </View>
              <View style={styles.botones}>{acciones(institucion)}</View>
            </View>
          ))}
          {datos !== undefined ? <Text style={styles.totalSuelto}>{total}</Text> : null}
        </>
      ) : (
        <View style={[styles.tarjeta, styles.lista]}>
          {aviso ? <Text style={styles.vacio}>{aviso}</Text> : null}
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
              <Text
                style={[
                  styles.celda,
                  styles.columnaCorta,
                  institucion.acronimo ? null : styles.sinDato,
                ]}
              >
                {institucion.acronimo || SIN_ACRONIMO}
              </Text>
              <Text style={[styles.celda, styles.columna]}>{institucion.dominioCorreo}</Text>
              <View style={styles.acciones}>{acciones(institucion)}</View>
            </View>
          ))}
          {datos !== undefined ? <Text style={styles.total}>{total}</Text> : null}
        </View>
      )}

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
    paddingHorizontal: 4,
    fontFamily: fuente.negrita,
    fontSize: 15,
    color: color.texto,
    textAlign: 'center',
  },
  separado: {
    borderLeftWidth: 1,
    borderLeftColor: color.grisOscuro,
  },
  // con este mínimo la fila no se parte en dos en los anchos más justos (700 y 900 px)
  columna: {
    flex: 1,
    minWidth: 90,
  },
  // columna del acrónimo: angosta y centrada, para que no se pegue al nombre
  columnaCorta: {
    width: 92,
    textAlign: 'center',
  },
  sinDato: {
    color: color.textoSuave,
  },
  // el acrónimo se ve en mayúsculas mientras se escribe; el servidor lo guarda así
  mayusculas: {
    textTransform: 'uppercase',
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
  ficha: {
    gap: 10,
    padding: 16,
  },
  cabeceraFicha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nombreFicha: {
    flex: 1,
    fontFamily: fuente.negrita,
    fontSize: 15,
    color: color.texto,
  },
  etiqueta: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.malva,
  },
  // sobre el fondo de la institución inactiva el malva no se lee bien
  etiquetaInactiva: {
    color: color.textoSuave,
  },
  botones: {
    flexDirection: 'row',
    gap: 8,
  },
  totalSuelto: {
    paddingHorizontal: 4,
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
});
