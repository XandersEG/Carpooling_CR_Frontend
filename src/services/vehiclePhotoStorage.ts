import { createClient } from '@supabase/supabase-js';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';

const BUCKET = 'vehicle-photos'; // el nombre de tu bucket

// Solo sirve para subir con el token firmado que da el Backend; la anon key es pública por diseño.
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  { auth: { persistSession: false } },
);

type UploadTarget = { path: string; token: string; publicUrl: string };

const isRemote = (uri: string) => /^https?:\/\//.test(uri);

async function uploadOne(uri: string): Promise<string> {
  if (isRemote(uri)) return uri; // ya subida

  const target = await apiRequest<UploadTarget>('/driver/vehicles/photo-upload-url', { method: 'POST' });
  const file = await (await fetch(uri)).arrayBuffer();
  const contentType = uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const { error } = await supabase.storage.from(BUCKET).uploadToSignedUrl(target.path, target.token, file, { contentType });
  if (error) throw new Error('No se pudo subir la foto. Inténtalo de nuevo.');
  return target.publicUrl;
}

/** Sube las fotos locales (file://) y devuelve solo URLs remotas. Con mocks no sube nada. */
export async function uploadVehiclePhotos(uris: string[]): Promise<string[]> {
  if (USE_MOCK_DATA) return uris;
  return Promise.all(uris.map(uploadOne));
}