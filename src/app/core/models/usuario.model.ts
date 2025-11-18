export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  correo: string;
  password?: string; // opcional, solo se usa en registro/login
  rol?: string;
  esAdmin?: boolean;
  activo?: boolean;
  verificationToken?: string; // opcional, usado en registro
}
