import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { ConsultaTabs, analyticsStyles, isConsultaTab } from '@/components/web/analytics';
import { AverageAmountView } from '@/components/web/consultas/AverageAmountView';
import { NewUsersView } from '@/components/web/consultas/NewUsersView';
import { RankingQueryView } from '@/components/web/consultas/RankingQueryView';
import { TripListView } from '@/components/web/consultas/TripListView';

/** Consultas generales (sección 7:434): 6 consultas en pestañas numeradas. */
export default function GeneralQueriesScreen() {
  const { tab } = useLocalSearchParams<{ tab: string }>();

  useAdminHeader({
    title: 'Consultas generales',
    subtitle: 'Consulta registros específicos del servicio y aplica filtros por institución y fechas.',
  });

  if (!isConsultaTab(tab)) {
    return <Redirect href="/admin/consultas/top-conductores" />;
  }

  return (
    <View style={analyticsStyles.page}>
      <ConsultaTabs active={tab} />
      {tab === 'top-conductores' ? <RankingQueryView key="conductores" kind="conductores" /> : null}
      {tab === 'puntos-concurrentes' ? <RankingQueryView key="puntos" kind="puntos" /> : null}
      {tab === 'usuarios-activos' ? <RankingQueryView key="usuarios" kind="usuarios" /> : null}
      {tab === 'listado-viajes' ? <TripListView /> : null}
      {tab === 'monto-promedio' ? <AverageAmountView /> : null}
      {tab === 'usuarios-nuevos' ? <NewUsersView /> : null}
    </View>
  );
}
