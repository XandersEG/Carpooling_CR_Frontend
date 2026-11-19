export type LoginCredentials = {
  correo: string;
  password: string;
};

/** Respuesta de `POST /auth/login`. */
export type LoginResponse = {
  token: string;
  nombre: string;
};

/** Respuesta de `POST /auth/register`. */
export type RegisterResponse = {
  message: string;
  user: { id: number; email: string };
  emailVerified: boolean;
};
