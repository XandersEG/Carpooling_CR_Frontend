/**
 * Texto de "Términos y condiciones" (Figma 3069:3947, sección
 * `TerminosYCondiciones`), transcrito sin cambios de contenido.
 */

export type TermsSection = {
  number: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type TermsReference = {
  /** Parte destacada ("Ley N.° 9078"). */
  name?: string;
  text: string;
};

export const termsIntro =
  'Conocé cómo funciona nuestra plataforma de viajes compartidos, tus derechos y las responsabilidades de los participantes.';

export const termsSections: TermsSection[] = [
  {
    number: '01',
    title: 'Objeto y funcionamiento',
    paragraphs: [
      'Tuanis Carpooling es una plataforma digital diseñada para facilitar el contacto y la coordinación de viajes compartidos entre personas que conducen y personas que requieren trasladarse hacia destinos compatibles.',
      'La plataforma permite publicar y consultar trayectos, solicitar o aceptar participación en viajes y comunicarse para coordinar detalles. Su uso no sustituye las autorizaciones, permisos o requisitos legales que pudieran ser exigibles para una actividad de transporte.',
    ],
  },
  {
    number: '02',
    title: 'Aceptación de los términos',
    paragraphs: [
      'Al registrarse y marcar la casilla correspondiente, la persona usuaria declara que ha leído y acepta estos Términos y Condiciones y la Política de Privacidad que se facilite por separado.',
      'Quien no esté de acuerdo con estas disposiciones no deberá continuar con el registro ni utilizar los servicios de la plataforma.',
    ],
  },
  {
    number: '03',
    title: 'Registro y cuenta',
    paragraphs: [
      'Las personas usuarias deberán proporcionar información veraz, actualizada y suficiente durante el registro, mantener la confidencialidad de sus credenciales y comunicar cualquier acceso no autorizado.',
      'La participación está sujeta a los requisitos de capacidad y edad que correspondan legalmente. Tuanis Carpooling podrá solicitar validaciones razonables para proteger la integridad de la comunidad, de conformidad con la normativa aplicable.',
    ],
  },
  {
    number: '04',
    title: 'Publicación y reserva de viajes',
    paragraphs: [
      'Las personas conductoras deberán comunicar con claridad el origen, destino, horario, puntos de encuentro, disponibilidad de asientos y cualquier condición relevante del trayecto.',
      'Las personas pasajeras deberán revisar la información antes de solicitar un espacio. La aceptación de una solicitud y los detalles operativos del viaje estarán sujetos a confirmación entre las partes.',
    ],
  },
  {
    number: '05',
    title: 'Obligaciones de conductores',
    bullets: [
      'Contar con licencia de conducir vigente y apropiada para el vehículo.',
      'Mantener el vehículo en condiciones legales y seguras de circulación, con los seguros y requisitos exigibles.',
      'Respetar las normas de tránsito, los límites de velocidad y la capacidad autorizada del vehículo.',
      'Informar cambios de ruta, atrasos o cancelaciones oportunamente y evitar conducir bajo efectos de alcohol u otras sustancias.',
      'Contar, cuando legalmente corresponda, con los permisos o autorizaciones para la modalidad de transporte realizada.',
    ],
  },
  {
    number: '06',
    title: 'Obligaciones de pasajeros',
    bullets: [
      'Presentarse puntualmente en los lugares acordados.',
      'Utilizar el cinturón de seguridad y cumplir las indicaciones de seguridad razonables.',
      'Respetar al conductor, a las demás personas y al vehículo.',
      'Informar cualquier necesidad especial relevante para la coordinación del viaje.',
      'No portar objetos ilícitos ni realizar conductas que comprometan la seguridad.',
    ],
  },
  {
    number: '07',
    title: 'Convivencia y conducta',
    paragraphs: [
      'Se prohíben el acoso, la discriminación, las amenazas, la violencia, el fraude, la suplantación de identidad y cualquier conducta ilegal o que ponga en riesgo a otras personas.',
      'Todas las interacciones deben realizarse con respeto. Se invita a reportar incidentes mediante los canales de soporte que la plataforma habilite.',
    ],
  },
  {
    number: '08',
    title: 'Gastos compartidos y pagos',
    paragraphs: [
      'Cuando se acuerda compartir gastos de un desplazamiento, las partes deberán conocer previamente los importes, las condiciones y el método de pago. Ningún cargo debe presentarse de manera engañosa.',
      'La coordinación de gastos no determina por sí sola la naturaleza jurídica del traslado: si una actividad constituye transporte remunerado o regulado, deberán cumplirse las autorizaciones y obligaciones que correspondan. Tuanis Carpooling no garantiza que toda modalidad de cobro esté permitida.',
      'La plataforma informará expresamente si en el futuro habilita pagos integrados, comisiones u otros cargos propios.',
    ],
  },
  {
    number: '09',
    title: 'Cancelaciones y cambios',
    paragraphs: [
      'Cualquier persona participante podrá solicitar cambios o cancelar su participación, procurando avisar con anticipación razonable. Las partes deberán comunicar atrasos o imprevistos tan pronto los conozcan.',
      'Las condiciones de posibles reembolsos o cargos por cancelación deberán informarse antes de contratar o confirmar un pago, cuando resulten aplicables.',
    ],
  },
  {
    number: '10',
    title: 'Seguridad y emergencias',
    paragraphs: [
      'La seguridad de las personas tiene prioridad. Ante una situación de peligro, se recomienda detener la actividad cuando sea seguro hacerlo y contactar a los servicios de emergencia competentes.',
      'La plataforma puede incorporar herramientas de denuncia, contacto o reporte; estas no sustituyen los servicios públicos de emergencia ni garantizan asistencia inmediata.',
    ],
  },
  {
    number: '11',
    title: 'Seguros y accidentes',
    paragraphs: [
      'Cada conductor es responsable de mantener los seguros exigidos legalmente y de cumplir los procedimientos pertinentes ante un accidente. Las personas usuarias deberán colaborar con las autoridades y aseguradoras cuando proceda.',
      'El uso de Tuanis Carpooling no implica la existencia de una póliza adicional de cobertura para los viajes, salvo que dicha cobertura sea anunciada y acreditada expresamente por la plataforma.',
    ],
  },
  {
    number: '12',
    title: 'Responsabilidades de las partes',
    paragraphs: [
      'Conductores y pasajeros son responsables de sus propias decisiones, declaraciones y acciones, sin perjuicio de las responsabilidades legales que correspondan.',
      'Tuanis Carpooling facilitará las funciones digitales anunciadas y responderá por sus propias obligaciones en los términos establecidos por la legislación aplicable. Ninguna cláusula pretende excluir derechos irrenunciables de las personas consumidoras ni responsabilidades que la ley no permita limitar.',
    ],
  },
  {
    number: '13',
    title: 'Datos personales y geolocalización',
    paragraphs: [
      'Los datos personales proporcionados durante el registro y uso de la plataforma se tratarán para gestionar cuentas, facilitar la coordinación de viajes, atender solicitudes y cumplir las obligaciones legales pertinentes.',
      'El tratamiento de ubicación y otros datos que lo requieran deberá acompañarse de información clara sobre finalidades, responsables, conservación, destinatarios y mecanismos para ejercer los derechos de las personas titulares, según la Ley N.° 8968 y disposiciones aplicables.',
      'La Política de Privacidad deberá explicar estas condiciones de forma específica. Aceptar estos términos no reemplaza los consentimientos separados que legalmente se exijan.',
    ],
  },
  {
    number: '14',
    title: 'Valoraciones, reportes y denuncias',
    paragraphs: [
      'Si la plataforma dispone de herramientas de valoración o reporte, las personas usuarias deberán utilizarlas de buena fe, sin publicar datos privados innecesarios, afirmaciones deliberadamente falsas ni contenido discriminatorio.',
      'Tuanis Carpooling podrá revisar reportes conforme a procedimientos proporcionales y respetuosos de los derechos de las partes.',
    ],
  },
  {
    number: '15',
    title: 'Disponibilidad del servicio',
    paragraphs: [
      'La plataforma podrá experimentar interrupciones de conexión, mantenimiento o fallos técnicos. Se procurará comunicar las incidencias relevantes y restablecer las funciones dentro de posibilidades razonables.',
      'No se garantiza que siempre existan viajes, asientos disponibles o coincidencias entre rutas.',
    ],
  },
  {
    number: '16',
    title: 'Propiedad intelectual',
    paragraphs: [
      'El diseño, el nombre, los contenidos y los elementos propios de Tuanis Carpooling están sujetos a los derechos de propiedad intelectual de sus respectivos titulares.',
      'El acceso a la plataforma no autoriza su reproducción, venta o explotación no permitida. Cada persona conserva los derechos que legalmente le correspondan sobre el contenido que aporte.',
    ],
  },
  {
    number: '17',
    title: 'Suspensión y cierre de cuentas',
    paragraphs: [
      'Podrán adoptarse medidas proporcionadas ante indicios razonables de fraude, incumplimiento grave, amenazas a la seguridad o uso ilícito de la plataforma, observando la normativa aplicable.',
      'Las personas usuarias podrán solicitar el cierre de sus cuentas mediante los canales que se habiliten, sin perjuicio de la conservación de información exigida por ley.',
    ],
  },
  {
    number: '18',
    title: 'Modificaciones de los términos',
    paragraphs: [
      'Los términos podrán actualizarse por cambios funcionales, operativos o legales. Las modificaciones importantes se comunicarán por medios razonables y con la anticipación que corresponda.',
      'Cuando una modificación requiera nueva aceptación o consentimiento, la plataforma deberá solicitarlo antes de aplicar el cambio a la persona usuaria.',
    ],
  },
  {
    number: '19',
    title: 'Consultas, quejas y reclamos',
    paragraphs: [
      'Las consultas, reclamaciones de cobros o denuncias relacionadas con la plataforma podrán presentarse por el canal oficial de soporte que Tuanis Carpooling publique. Para una operación real deberá identificarse al responsable del servicio y facilitarse información de contacto verificable.',
      'Estas condiciones no restringen el acceso a las autoridades administrativas o judiciales competentes ni los derechos de las personas consumidoras.',
    ],
  },
  {
    number: '20',
    title: 'Vigencia y confirmación',
    paragraphs: [
      'Estos términos se presentan como versión de referencia de Tuanis Carpooling para Costa Rica. Su versión definitiva entrará en vigencia en la fecha publicada oficialmente por la plataforma.',
      'Durante el registro, la persona usuaria podrá consultar el documento y manifestar su aceptación mediante una casilla independiente del enlace de lectura.',
    ],
  },
];

export const termsNotice = {
  lead: 'Información relevante:',
  text: 'compartir gastos entre personas no implica automáticamente estar exento de la regulación del transporte remunerado. La clasificación de cada operación depende de sus características reales y de las normas aplicables.',
};

export const termsReferencesTitle = 'Referencias normativas de Costa Rica';

export const termsReferencesIntro =
  'Estas fuentes orientan el diseño de los términos; no representan una certificación de cumplimiento legal.';

export const termsReferences: TermsReference[] = [
  { name: 'Ley N.° 9078', text: 'Ley de Tránsito por Vías Públicas Terrestres y Seguridad Vial.' },
  { name: 'Ley N.° 8968', text: 'Protección de la Persona frente al Tratamiento de sus Datos Personales.' },
  { name: 'Ley N.° 7472', text: 'Promoción de la Competencia y Defensa Efectiva del Consumidor.' },
  { name: 'Ley N.° 8454', text: 'Certificados, Firmas Digitales y Documentos Electrónicos.' },
  { text: 'Decreto Ejecutivo N.° 37899-MEIC — Reglamento de la Ley N.° 7472.' },
  {
    name: 'Dictamen PGR-C-029-2025',
    text: 'Pronunciamiento sobre los permisos para servicios especiales de transporte remunerado, no una autorización general de plataformas de carpooling.',
  },
];
