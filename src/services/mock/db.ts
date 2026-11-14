/**
 * "Base de datos" en memoria para los servicios simulados.
 *
 * Se inicializa con copias de los datos de ejemplo; los cambios (aceptar una
 * solicitud, eliminar un parámetro, etc.) se mantienen mientras la app esté
 * abierta y se pierden al recargarla.
 */
import type { CatalogItemMap, CatalogKey } from '@/src/types/admin';

import * as admin from './fixtures/admin';
import * as mobile from './fixtures/mobile';
import { clone } from './utils';

export const db = {
  currentUser: clone(mobile.currentUser),
  savedPlaces: clone(mobile.savedPlaces),
  vehicles: clone(mobile.myVehicles),
  availableTrips: clone(mobile.availableTrips),
  pickupPoints: clone(mobile.pickupPoints),
  passengerTrips: clone(mobile.passengerTrips),
  driverTrips: clone(mobile.driverTrips),
  incomingRequests: clone(mobile.incomingRequests),
  tripHistory: clone(mobile.tripHistory),

  institutions: clone(admin.institutions),
  adminUsers: clone(admin.adminUsers),
  adminUserDetails: clone(admin.adminUserDetails),
  catalogs: {
    'metodos-pago': clone(admin.paymentMethodItems),
    'tipos-vehiculo': clone(admin.vehicleTypeItems),
    'rangos-edad': clone(admin.ageRangeItems),
    'opciones-genero': clone(admin.genderOptionItems),
    'reglas-tarifas': clone(admin.ruleItems),
  } satisfies { [K in CatalogKey]: CatalogItemMap[K][] },
};
