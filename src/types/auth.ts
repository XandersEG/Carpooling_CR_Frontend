export type LoginCredentials = {
  email: string;
  password: string;
};

// Provisional: confirmar la estructura real de la respuesta con el equipo de Backend.
export type LoginResponse = {
  token: string;
};
