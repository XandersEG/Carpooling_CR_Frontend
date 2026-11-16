import { useRouter } from 'expo-router';
import { Text } from 'react-native';

import { AccessButton, AccessScreen, accessStyles } from '@/components/admin/AccessScreen';

// aviso de que el correo va en camino. el paso siguiente llega por el enlace de ese correo
export function RecoverPasswordSentScreen() {
  const router = useRouter();

  return (
    <AccessScreen title="Revisa tu correo" sinNota>
      <Text style={accessStyles.texto}>
        Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
      </Text>
      <Text style={accessStyles.nota}>
        El enlace vence en 30 minutos y solo se puede usar una vez.
      </Text>
      <AccessButton
        label="Volver al inicio de sesión"
        onPress={() => router.replace('/admin/login')}
      />
    </AccessScreen>
  );
}
