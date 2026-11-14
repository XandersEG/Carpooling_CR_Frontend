/**
 * Datos de ejemplo del portal administrativo, tomados de los diseños de Figma
 * (docs/design/screens-inventory.md §3). Solo para desarrollo.
 */
import type {
  AdminUserDetail,
  AdminUserSummary,
  AgeRangeItem,
  GenderOptionItem,
  Institution,
  PaymentMethodItem,
  RuleItem,
  VehicleTypeItem,
} from '@/src/types/admin';

export const institutions: Institution[] = [
  { id: 'i-ice', name: 'ICE', email: 'EduardoSolis_cm@inst.cr.com', validationStatus: 'validada', active: true },
  { id: 'i-ins', name: 'INS', email: 'JohnnyGonzales@ins.cr', validationStatus: 'sin_validar', active: true },
  {
    id: 'i-tec',
    name: 'Tecnológico de Costa Rica',
    email: 'aalvarez@itcr.ac.cr',
    validationStatus: 'sin_validar',
    active: false,
  },
  {
    id: 'i-ucr',
    name: 'Universidad de Costa Rica',
    email: 'carlos.arayaleandro@ucr.ac.cr',
    validationStatus: 'pendiente',
    active: true,
  },
  {
    id: 'i-una',
    name: 'Universidad Nacional',
    email: 'jorge.herrera.murillo@una.cr',
    validationStatus: 'sin_validar',
    active: true,
  },
];

const userNames = [
  'Diego Jose Araya Cordero',
  'Maicol Antonio Araya Urbina',
  'Pablo Josue Arguedas Alfaro',
  'Sofia Elena Barrantes Miranda',
  'Wesley Alberto Campos Raith',
  'Valeria Cascante Arce',
  'Xanders Espinoza Guzman',
  'Luis Felipe Gonzalez Brenes',
  'Abril Gonzalez Morales',
  'Hector Granados Quiros',
  'Eliab Hernandez Lopez',
  'Paulo Herrera Arias',
  'Kevin Jimenez Escalante',
  'Danny Jimenez Sevilla',
  'Javier Lee Liang',
  'Kaleb Lizano Rojas',
  'Steven Loaiciga Segura',
  'Andres Madrigal Garro',
];

export const adminUsers: AdminUserSummary[] = userNames.map((fullName, index) => ({
  id: `au-${index + 1}`,
  fullName,
  active: true,
}));

/** El diseño solo incluye el detalle de este usuario. */
export const adminUserDetails: AdminUserDetail[] = [
  {
    id: 'au-1',
    fullName: 'Diego Jose Araya Cordero',
    active: true,
    academicId: '2024087949',
    email: 'd.araya.2@estudiantec.cr',
    phone: '+506 8451 4072',
    institutionName: 'Tecnológico de Costa Rica',
    isAdmin: false,
    vehicles: [
      {
        id: 'av-yaris',
        brand: 'Toyota',
        model: 'Yaris',
        plate: 'ABC-123',
        year: 2018,
        color: 'Gris',
        capacity: 4,
        photoUrls: [],
        active: true,
      },
    ],
    activity: {
      completedTrips: 24,
      asDriver: 18,
      asPassenger: 6,
      history: [
        { id: 'ah-1', date: '2026-10-22', route: 'Cartago → TEC, Cartago', role: 'conductor', status: 'completado' },
        { id: 'ah-2', date: '2026-10-21', route: 'TEC, Cartago → San José', role: 'pasajero', status: 'completado' },
        { id: 'ah-3', date: '2026-10-20', route: 'San José → TEC, Cartago', role: 'conductor', status: 'cancelado' },
      ],
    },
  },
];

export const paymentMethodItems: PaymentMethodItem[] = [
  {
    id: 'pm-sinpe',
    name: 'SINPE Móvil',
    description: 'Transferencia al número del conductor al finalizar el viaje',
    active: true,
  },
  { id: 'pm-efectivo', name: 'Efectivo', description: 'Pago en colones directamente al conductor', active: true },
  {
    id: 'pm-gratuito',
    name: 'Gratuito / Solidario',
    description: 'El conductor ofrece el viaje sin costo',
    active: true,
  },
];

export const vehicleTypeItems: VehicleTypeItem[] = [
  { id: 'vt-sedan', name: 'Sedán', maxCapacity: 4, description: 'Automóvil de cuatro puertas con maletero', active: true },
  { id: 'vt-hatchback', name: 'Hatchback', maxCapacity: 4, description: 'Automóvil compacto con puerta trasera', active: true },
  { id: 'vt-suv', name: 'SUV', maxCapacity: 6, description: 'Vehículo utilitario de tamaño mediano o grande', active: true },
  {
    id: 'vt-pickup',
    name: 'Pick-up',
    maxCapacity: 4,
    description: 'Doble cabina; no se permiten pasajeros en el cajón',
    active: true,
  },
  { id: 'vt-microbus', name: 'Microbús', maxCapacity: 12, description: 'Requiere permiso de transporte del CTP', active: false },
];

export const ageRangeItems: AgeRangeItem[] = [
  { id: 'ar-18', name: '18 a 24 años', minAge: 18, maxAge: 24, active: true },
  { id: 'ar-25', name: '25 a 34 años', minAge: 25, maxAge: 34, active: true },
  { id: 'ar-35', name: '35 a 49 años', minAge: 35, maxAge: 49, active: true },
  { id: 'ar-50', name: '50 años o más', minAge: 50, maxAge: null, active: true },
];

export const genderOptionItems: GenderOptionItem[] = [
  { id: 'g-f', name: 'Femenino', registeredUsers: 412, active: true },
  { id: 'g-m', name: 'Masculino', registeredUsers: 538, active: true },
  { id: 'g-nb', name: 'No binario', registeredUsers: 17, active: true },
  { id: 'g-ni', name: 'Prefiero no indicarlo', active: true },
];

export const ruleItems: RuleItem[] = [
  {
    id: 'rt-km',
    name: 'Tarifa máxima por kilómetro',
    value: 150,
    unit: '₡ por km',
    description: 'Monto máximo que el conductor puede cobrar por km',
    active: true,
  },
  {
    id: 'rt-max',
    name: 'Aporte máximo por viaje',
    value: 3000,
    unit: '₡',
    description: 'Tope de cobro por pasajero en un mismo viaje',
    active: true,
  },
  {
    id: 'rt-cancel',
    name: 'Cancelación sin penalización',
    value: 30,
    unit: 'minutos',
    description: 'Tiempo mínimo de aviso para cancelar un viaje',
    active: true,
  },
  {
    id: 'rt-wait',
    name: 'Tiempo de espera del conductor',
    value: 5,
    unit: 'minutos',
    description: 'Espera máxima en el punto de encuentro',
    active: true,
  },
];
