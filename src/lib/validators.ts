import { z } from "zod";

export const eventTypeLabels = {
  CULTO: "Culto",
  FESTIVIDADE: "Festividade/Congresso",
} as const;

export const eventSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  type: z.enum(["CULTO", "FESTIVIDADE"]),
  churchId: z.string().min(1, "Selecione a igreja"),
  startsAt: z.string().min(1, "Informe o início"),
  endsAt: z.string().min(1, "Informe o fim"),
  location: z.string().min(3, "Informe o local"),
  description: z.string().optional().default(""),
  posterUrl: z.string().optional().nullable(),
});

export const churchSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  address: z.string().min(5, "Informe o endereço"),
  neighborhood: z.string().min(2, "Informe o bairro"),
  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP inválido")
    .transform((v) => `${v.slice(0, 5)}-${v.slice(5)}`),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (#RRGGBB)"),
});

export const leaderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  churchId: z.string().optional().nullable(),
  role: z.enum(["LEADER", "ADMIN"]).default("LEADER"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha com no mínimo 6 caracteres"),
  role: z.enum(["LEADER"]),
  churchName: z.string().min(2, "Nome da igreja obrigatório"),
  churchCity: z.string().min(2, "Cidade obrigatória"),
  churchAddress: z.string().min(5, "Informe o endereço"),
  churchNeighborhood: z.string().min(2, "Informe o bairro"),
  churchCep: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP inválido")
    .transform((v) => `${v.slice(0, 5)}-${v.slice(5)}`),
  churchColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (#RRGGBB)"),
});
