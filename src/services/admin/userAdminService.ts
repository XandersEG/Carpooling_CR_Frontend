/**
 * Gestión > Usuarios (portal administrativo).
 *
 * Provisional: implementación simulada con datos de ejemplo. El diseño solo
 * incluye el detalle de un usuario; para los demás `getUserDetail` falla.
 */
import type { AdminUserDetail, AdminUserSummary } from '@/src/types/admin';
import type { Id } from '@/src/types/common';

import { db } from '../mock/db';
import { notFound, respond } from '../mock/utils';

function findUser(id: Id): AdminUserSummary {
  const user = db.adminUsers.find((item) => item.id === id);
  if (!user) throw notFound('Usuario', id);
  return user;
}

export async function listUsers(): Promise<AdminUserSummary[]> {
  return respond(db.adminUsers);
}

export async function getUserDetail(id: Id): Promise<AdminUserDetail> {
  const detail = db.adminUserDetails.find((item) => item.id === id);
  if (!detail) throw notFound('Detalle de usuario', id);
  return respond(detail);
}

export async function setUserActive(id: Id, active: boolean): Promise<AdminUserSummary> {
  const user = findUser(id);
  user.active = active;
  const detail = db.adminUserDetails.find((item) => item.id === id);
  if (detail) detail.active = active;
  return respond(user);
}

/** "Dar rango Administrador" / "Quitar Administrador". */
export async function setUserAdmin(id: Id, isAdmin: boolean): Promise<AdminUserDetail> {
  const detail = db.adminUserDetails.find((item) => item.id === id);
  if (!detail) throw notFound('Detalle de usuario', id);
  detail.isAdmin = isAdmin;
  return respond(detail);
}

export async function deleteUser(id: Id): Promise<void> {
  findUser(id);
  db.adminUsers = db.adminUsers.filter((item) => item.id !== id);
  db.adminUserDetails = db.adminUserDetails.filter((item) => item.id !== id);
  await respond(undefined);
}
