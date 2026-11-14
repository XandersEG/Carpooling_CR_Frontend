/**
 * Gestión > Instituciones (portal administrativo).
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { Institution, InstitutionInput } from '@/src/types/admin';
import type { Id } from '@/src/types/common';

import { db } from '../mock/db';
import { createId, notFound, respond } from '../mock/utils';

function findInstitution(id: Id): Institution {
  const institution = db.institutions.find((item) => item.id === id);
  if (!institution) throw notFound('Institución', id);
  return institution;
}

export async function listInstitutions(): Promise<Institution[]> {
  return respond(db.institutions);
}

export async function createInstitution(input: InstitutionInput): Promise<Institution> {
  const institution: Institution = {
    ...input,
    id: createId('i'),
    validationStatus: 'sin_validar',
    active: true,
  };
  db.institutions.push(institution);
  return respond(institution);
}

export async function updateInstitution(id: Id, input: InstitutionInput): Promise<Institution> {
  const institution = findInstitution(id);
  Object.assign(institution, input);
  return respond(institution);
}

export async function setInstitutionActive(id: Id, active: boolean): Promise<Institution> {
  const institution = findInstitution(id);
  institution.active = active;
  return respond(institution);
}

/** "Validar" / "Reenviar": envía el correo de validación y queda pendiente de confirmación. */
export async function sendValidationEmail(id: Id): Promise<Institution> {
  const institution = findInstitution(id);
  institution.validationStatus = 'pendiente';
  return respond(institution);
}
