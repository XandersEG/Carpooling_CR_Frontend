import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BottomSheet } from '@/components/mobile/BottomSheet';
import { CalendarPicker } from '@/components/mobile/CalendarPicker';
import { ConfirmDialog } from '@/components/mobile/driver/ConfirmDialog';
import { buildDepartureAt, paymentKind, vehicleName } from '@/components/mobile/driver/format';
import { IconInfo } from '@/components/mobile/driver/icons';
import {
  FieldGroup,
  PaymentMethodIcon,
  SectionTitle,
  StepTabs,
  type PublishStep,
} from '@/components/mobile/driver/PublishParts';
import { LocationPickerMap, type PickTarget } from '@/components/mobile/driver/LocationPickerMap';
import { VehicleCard } from '@/components/mobile/driver/VehicleCard';
import { NoticeBox } from '@/components/mobile/Detail';
import { Stepper } from '@/components/mobile/Form';
import { IconPlus } from '@/components/mobile/icons';
import { PlaceAutocomplete } from '@/components/mobile/PlaceAutocomplete';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SearchField } from '@/components/mobile/SearchField';
import { formatSlot, TimeSlotPicker } from '@/components/mobile/TimeSlotPicker';
import { Button } from '@/components/shared/Button';
import { colors, fonts, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { listPaymentMethods, publishTrip } from '@/src/services/driverService';
import { describePoint, type PlaceSuggestion } from '@/src/services/placeService';
import { activateVehicle, listMyVehicles } from '@/src/services/vehicleService';
import type { PaymentMethodItem } from '@/src/types/admin';
import type { GeoPoint } from '@/src/types/common';
import type { Vehicle } from '@/src/types/vehicle';
import { now } from '@/src/utils/clock';
import { formatPassengers, formatRelativeDay, toIsoDate } from '@/src/utils/format';

/** Height of the map hidden behind the title and fields card, so fitted points stay visible. */
const ROUTE_CARD_INSET = 200;

/** Hora inicial del diseño ("6:30 a. m."). */
const DEFAULT_TIME = '06:30';
/** Shown in a field while the address of its pin is being looked up. */
const LOOKING_UP_ADDRESS = 'Buscando dirección…';

/**
 * Asistente "Publicar Viaje" (Movil Punto 3): Vehículo (2390:1976), Ruta
 * (2538:7479), Horario (2538:7929), Pago (2538:8511 / 8676) y Confirmación
 * (2649:3251). Las pestañas permiten saltar a cualquier paso, como en el prototipo.
 */
export default function PublishTripScreen() {
  const [step, setStep] = useState<PublishStep>('vehiculo');

  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [toActivate, setToActivate] = useState<Vehicle | null>(null);
  const [activating, setActivating] = useState(false);
  // Backend error on activation; shown inside the dialog so the driver can retry
  const [activationError, setActivationError] = useState<string | null>(null);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  // points picked on the map; the Backend needs coordinates for both
  const [originPoint, setOriginPoint] = useState<GeoPoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<GeoPoint | null>(null);
  const [mapTarget, setMapTarget] = useState<PickTarget>('origen');

  const today = useMemo(() => toIsoDate(now()), []);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [picker, setPicker] = useState<'fecha' | 'hora' | null>(null);
  const [seats, setSeats] = useState(1);

  const [cost, setCost] = useState('');
  const [methods, setMethods] = useState<PaymentMethodItem[]>([]);
  const [methodId, setMethodId] = useState<string | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listMyVehicles().then((list) => {
        if (active) setVehicles(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  useEffect(() => {
    listPaymentMethods().then((items) => {
      const available = items.filter((item) => item.active);
      setMethods(available);
      setMethodId((current) => current ?? available.find((item) => paymentKind(item.name) === 'efectivo')?.id ?? null);
    });
  }, []);

  const activeVehicle = vehicles?.find((vehicle) => vehicle.active) ?? null;
  const maxSeats = Math.max(activeVehicle?.capacity ?? 1, 1);

  useEffect(() => {
    setSeats((current) => Math.min(current, maxSeats));
  }, [maxSeats]);

  const amount = Number.parseInt(cost.replace(/\D/g, ''), 10) || 0;
  const freeMethod = methods.find((item) => paymentKind(item.name) === 'gratuito') ?? null;
  const selectableMethods = methods.filter((item) => paymentKind(item.name) !== 'gratuito');
  // "Si el monto es 0 se publicará como gratis": se usa el método Gratuito del catálogo.
  const effectiveMethod = amount === 0 ? freeMethod : (methods.find((item) => item.id === methodId) ?? null);

  // latest address lookup per field: a slower, older answer must not overwrite a newer pin
  const lookupId = useRef({ origen: 0, destino: 0 });

  // Uber-style: the pin and the text always match. A tapped or dragged pin rewrites its
  // field with the address; after marking the origin, the next tap marks the destination.
  const pickPoint = (target: PickTarget, point: GeoPoint) => {
    // close the keyboard and the suggestion list so the map gets the attention
    Keyboard.dismiss();
    const setName = target === 'origen' ? setOrigin : setDestination;
    if (target === 'origen') {
      setOriginPoint(point);
      if (!destinationPoint) setMapTarget('destino');
    } else {
      setDestinationPoint(point);
    }

    const id = ++lookupId.current[target];
    setName(LOOKING_UP_ADDRESS);
    describePoint(point)
      .catch(() => null)
      .then((place) => {
        if (lookupId.current[target] !== id) return;
        // without an address the point is still valid; the driver can rename it
        setName(place?.name ?? 'Punto en el mapa');
      });
  };

  // a picked suggestion sets the field's name and its point on the map
  const selectPlace = (target: PickTarget, place: PlaceSuggestion) => {
    // a pending address lookup for this field no longer applies
    lookupId.current[target]++;
    if (target === 'origen') {
      setOrigin(place.name);
      setOriginPoint(place.point);
      if (!destinationPoint) setMapTarget('destino');
    } else {
      setDestination(place.name);
      setDestinationPoint(place.point);
    }
  };

  const confirmActivation = async () => {
    if (!toActivate) return;
    setActivating(true);
    setActivationError(null);
    try {
      setVehicles(await activateVehicle(toActivate.id));
      setToActivate(null);
    } catch (cause) {
      setActivationError(cause instanceof Error ? cause.message : 'No se pudo activar el vehículo.');
    } finally {
      setActivating(false);
    }
  };

  const confirmTrip = async () => {
    if (!activeVehicle) return setError('Elige el vehículo que utilizas para realizar viajes');
    if (!origin.trim() || !destination.trim()) return setError('Indica el punto de partida y el destino del viaje');
    if (origin === LOOKING_UP_ADDRESS || destination === LOOKING_UP_ADDRESS) {
      return setError('Espera a que se cargue la dirección del punto marcado');
    }
    if (!originPoint || !destinationPoint) return setError('Marca el origen y el destino en el mapa');
    if (!effectiveMethod) return setError('Define cómo se realizará el pago');
    setError(null);
    setPublishing(true);
    try {
      await publishTrip({
        vehicleId: activeVehicle.id,
        origin: { name: origin.trim() },
        originPoint,
        destination: { name: destination.trim() },
        destinationPoint,
        departureAt: buildDepartureAt(date, time),
        seats,
        costPerPassenger: amount,
        paymentMethodId: effectiveMethod.id,
      });
      router.replace('/publicar/publicado');
    } catch (cause) {
      // show the Backend's message (e.g. "El vehículo solo admite 4 pasajeros.")
      setError(cause instanceof Error ? cause.message : 'No se pudo publicar el viaje.');
    } finally {
      setPublishing(false);
    }
  };

  const dateLabel = formatRelativeDay(buildDepartureAt(date, time));
  const timeLabel = formatSlot(time);

  // only drivers publish: a user becomes a driver when registering their first vehicle
  // (the Backend also rejects trips from users without one)
  if (vehicles !== null && vehicles.length === 0) {
    return (
      <Screen
        scroll
        header={<ScreenHeader title="Publicar Viaje" onBack={() => router.navigate('/inicio')} />}
        contentStyle={styles.content}
      >
        <SectionTitle title="Aún no eres conductor" subtitle="Para publicar viajes primero registra un vehículo" />
        <NoticeBox text="Cuando registres tu vehículo podrás ofrecer viajes y recibir solicitudes de pasajeros." />
        <Button title="Registrar vehículo" onPress={() => router.push('/vehiculos/nuevo')} fullWidth />
      </Screen>
    );
  }

  const header = (
    <View style={styles.headerBlock}>
      <ScreenHeader title="Publicar Viaje" onBack={() => router.navigate('/inicio')} style={styles.header} />
      <StepTabs value={step} onChange={setStep} />
    </View>
  );

  let footer: ReactNode = undefined;
  if (step === 'vehiculo') {
    footer = (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Agregar vehículo"
        onPress={() => router.push('/vehiculos/nuevo')}
        style={({ pressed }) => [styles.fab, pressed ? styles.pressed : null]}
      >
        <IconPlus width={24} height={24} color={palette.white} />
      </Pressable>
    );
  } else if (step === 'confirmar') {
    footer = (
      <View style={styles.confirmFooter}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Confirmar viaje" loading={publishing} onPress={confirmTrip} style={styles.confirmButton} />
      </View>
    );
  }

  return (
    // the Ruta step does not scroll: its map fills the visible space under the fields
    <Screen
      scroll={step !== 'ruta'}
      header={header}
      footer={footer}
      contentStyle={step === 'ruta' ? styles.routeContent : styles.content}
    >
      {step === 'vehiculo' ? (
        <>
          <SectionTitle title="Mis vehículos" subtitle="Elige el vehículo que utilizas para realizar viajes" />
          {vehicles === null ? (
            <ActivityIndicator color={colors.primary} style={styles.loading} />
          ) : (
            <View style={styles.list}>
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={vehicle.active ? undefined : () => setToActivate(vehicle)}
                />
              ))}
            </View>
          )}
        </>
      ) : null}

      {step === 'ruta' ? (
        <View style={styles.routeArea}>
          {/* full-width map behind the title and the fields card */}
          <LocationPickerMap
            origin={originPoint}
            destination={destinationPoint}
            target={mapTarget}
            onPick={pickPoint}
            originLabel={origin.trim()}
            destinationLabel={destination.trim()}
            topInset={ROUTE_CARD_INSET}
            style={styles.routeMap}
          />
          <View style={styles.routeTitle}>
            <SectionTitle title="Ruta" subtitle="Indica el punto de partida y el destino del viaje" />
          </View>
          <View style={styles.routeCardWrapper}>
            {/* white band behind the top half of the card, as in "Buscar rutas" */}
            <View style={styles.routeCardBackdrop} />
            <FieldGroup>
              {/* focusing a field chooses which point the next tap on the map sets */}
              <PlaceAutocomplete
                kind="origen"
                value={origin}
                placeholder="Origen"
                onChangeText={setOrigin}
                onSelect={(place) => selectPlace('origen', place)}
                inputProps={{ onFocus: () => setMapTarget('origen') }}
              />
              <PlaceAutocomplete
                kind="destino"
                value={destination}
                placeholder="Destino"
                onChangeText={setDestination}
                onSelect={(place) => selectPlace('destino', place)}
                inputProps={{ onFocus: () => setMapTarget('destino') }}
              />
            </FieldGroup>
          </View>
          {/* hint floating at the bottom of the map */}
          <View style={styles.routeHint} pointerEvents="none">
            <Text style={styles.routeHintText}>
              {Platform.OS === 'web'
                ? 'El mapa interactivo solo está disponible en la app móvil.'
                : `Escribe un lugar o toca el mapa para marcar el ${mapTarget === 'origen' ? 'origen' : 'destino'}.`}
            </Text>
          </View>
        </View>
      ) : null}

      {step === 'horario' ? (
        <>
          <SectionTitle title="Fecha y hora" subtitle="Indique cuándo será el viaje" />
          <FieldGroup style={styles.groupSpacing}>
            <SearchField kind="fecha" value={dateLabel} onPress={() => setPicker('fecha')} />
            <SearchField kind="horario" value={timeLabel} onPress={() => setPicker('hora')} />
          </FieldGroup>
          <SectionTitle
            title="Capacidad de pasajeros"
            subtitle={'Indique cuántos pasajeros se pueden llevar\n(sin contar conductor)'}
            style={styles.sectionGap}
          />
          <View style={[styles.counterCard, styles.groupSpacing]}>
            <Stepper
              value={seats}
              min={1}
              max={maxSeats}
              onChange={setSeats}
              hint={`Máximo permitido: ${formatPassengers(maxSeats)}`}
            />
          </View>
          <BottomSheet visible={picker === 'fecha'} onClose={() => setPicker(null)}>
            <CalendarPicker
              value={date}
              minDate={today}
              onChange={(value) => {
                setDate(value);
                setPicker(null);
              }}
            />
          </BottomSheet>
          <BottomSheet visible={picker === 'hora'} onClose={() => setPicker(null)}>
            <TimeSlotPicker
              value={time}
              onChange={(value) => {
                setTime(value);
                setPicker(null);
              }}
            />
          </BottomSheet>
        </>
      ) : null}

      {step === 'pago' ? (
        <>
          <SectionTitle title="Costo" subtitle="Define el valor del viaje" />
          <View style={styles.costField}>
            <Text style={styles.currency}>₡</Text>
            <TextInput
              value={cost}
              onChangeText={(text) => setCost(text.replace(/\D/g, ''))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textPlaceholder}
              accessibilityLabel="Costo del viaje en colones"
              style={styles.costInput}
            />
          </View>
          <Text style={[styles.note, styles.costNote]}>
            El pago se realizará directamente entre el conductor y el pasajero. Si el monto es 0 se publicará como
            gratis.
          </Text>
          <SectionTitle title="Método de pago" subtitle="Define cómo se realizará el pago" style={styles.sectionGap} />
          <View accessibilityRole="radiogroup" style={[styles.methodsCard, styles.groupSpacing]}>
            {selectableMethods.map((method) => {
              const selected = method.id === methodId;
              return (
                <Pressable
                  key={method.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setMethodId(method.id)}
                  style={styles.methodRow}
                >
                  <View style={[styles.radio, selected ? styles.radioSelected : null]} />
                  <PaymentMethodIcon kind={paymentKind(method.name)} />
                  <Text style={styles.methodName}>{method.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {step === 'confirmar' ? (
        <>
          <SectionTitle title="Confirmación" subtitle="Confirma que los datos son correctos" />
          {activeVehicle ? <VehicleCard vehicle={activeVehicle} capacity={seats} style={styles.groupSpacing} /> : null}
          <FieldGroup style={styles.groupSpacing}>
            <SearchField kind="origen" value={origin.trim()} placeholder="Origen" />
            <SearchField kind="destino" value={destination.trim()} placeholder="Destino" />
            <SearchField kind="fecha" value={dateLabel} />
            <SearchField kind="horario" value={timeLabel} />
          </FieldGroup>
          {effectiveMethod ? (
            <View style={styles.summaryMethod}>
              <PaymentMethodIcon kind={paymentKind(effectiveMethod.name)} />
              <Text style={styles.methodName}>{effectiveMethod.name}</Text>
            </View>
          ) : null}
        </>
      ) : null}

      <ConfirmDialog
        visible={toActivate !== null}
        icon={<IconInfo width={40} height={40} />}
        iconBackground={colors.surfaceInput}
        title="¿Activar vehículo?"
        message={toActivate ? `¿Seguro que deseas activar el ${vehicleName(toActivate)} ${toActivate.plate}?` : ''}
        cancelLabel="Cancelar"
        confirmLabel="Activar"
        confirmVariant="primary"
        loading={activating}
        error={activationError}
        onCancel={() => {
          setToActivate(null);
          setActivationError(null);
        }}
        onConfirm={confirmActivation}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    backgroundColor: palette.white,
  },
  header: {
    paddingBottom: 20,
  },
  content: {
    paddingTop: 20,
    gap: spacing.xs,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
  list: {
    gap: spacing.xl * 2,
    marginTop: spacing.xs,
  },
  groupSpacing: {
    marginTop: spacing.xl,
  },
  sectionGap: {
    marginTop: spacing.xl * 3,
  },
  routeContent: {
    flex: 1,
  },
  routeArea: {
    flex: 1,
  },
  routeMap: {
    ...StyleSheet.absoluteFill,
    height: '100%',
  },
  routeTitle: {
    paddingTop: 20,
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  routeCardWrapper: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.screen,
  },
  routeCardBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: colors.background,
  },
  routeHint: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
    bottom: spacing.m,
    alignItems: 'center',
  },
  routeHintText: {
    ...typography.textSmall,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
    textAlign: 'center',
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radius.card,
    ...shadows.mapLabel,
  },
  note: {
    ...typography.subtitle,
    marginTop: spacing.xl * 2,
    color: colors.textSubtitle,
  },
  costNote: {
    marginTop: spacing.xl * 2,
    paddingHorizontal: spacing.screen,
  },
  counterCard: {
    paddingVertical: spacing.xl + 4,
    paddingHorizontal: spacing.xl * 2,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  costField: {
    width: '100%',
    maxWidth: 263,
    height: 44,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginTop: 30,
    paddingHorizontal: spacing.s,
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  currency: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: colors.textPlaceholder,
  },
  costInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: colors.textPrimary,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  methodsCard: {
    gap: spacing.l,
    paddingVertical: spacing.xl + 4,
    paddingHorizontal: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  methodRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  radio: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    backgroundColor: palette.white,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  methodName: {
    ...typography.nameHighlight,
    color: colors.textPrimary,
  },
  summaryMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    marginTop: spacing.xl * 2,
  },
  fab: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGreen,
  },
  pressed: {
    opacity: 0.8,
  },
  confirmFooter: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  confirmButton: {
    minWidth: 172,
  },
  error: {
    ...typography.textSmall,
    alignSelf: 'stretch',
    color: colors.error,
  },
});
