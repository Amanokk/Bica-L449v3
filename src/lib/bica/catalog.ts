import type { Carga, Entry, Lado, Material, MeioFio, Veiculo } from "./types";

export const SERVICOS = [
  "para base",
  "Pulmão",
  "para sub base",
  "para sub leito",
  "canteiro",
] as const;

export const LOCAIS = [
  "CANTEIRO",
  "Rua Visconde de Itaboraí",
  "Rua Prefeito Augusto de Andrade",
] as const;

export const OCS = ["154.951", "155.733", "155.892", "157.742", "157.838"] as const;

export type Fleet = {
  frota: string;
  placa: string;
  veiculo: Veiculo;
};

export const FLEET: Fleet[] = [
  { frota: "241", placa: "RQN6A88", veiculo: "Caminhão" },
  { frota: "243", placa: "RQN6A52", veiculo: "Caminhão" },
  { frota: "247", placa: "RQP9D26", veiculo: "Caminhão" },
  { frota: "249", placa: "RBJ6F60", veiculo: "Caminhão" },
  { frota: "255", placa: "RQO6C23", veiculo: "Caminhão" },
  { frota: "275", placa: "SFX7F89", veiculo: "Caminhão" },
  { frota: "276", placa: "SFX7G09", veiculo: "Caminhão" },
  { frota: "128", placa: "KQT9A95", veiculo: "Carreta" },
  { frota: "156", placa: "KWC9J23", veiculo: "Carreta" },
  { frota: "159", placa: "KPP4G22", veiculo: "Carreta" },
  { frota: "88", placa: "", veiculo: "Caminhão" },
  { frota: "162", placa: "", veiculo: "Caminhão" },
];

export function localForServico(servico: string): string {
  if (servico === "para base") return "Rua Visconde de Itaboraí";
  if (servico === "para sub base" || servico === "para sub leito") {
    return "Rua Prefeito Augusto de Andrade";
  }
  return "CANTEIRO";
}

export function brDate(iso: string): string {
  const [, m, d] = iso.split("-");
  if (!d || !m) return iso;
  return `${d}/${m}`;
}

export function weekday(iso: string): string {
  const dt = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function fleetLabel(frota: string): string {
  const n = frota.replace(/^LYC[-\s]*/i, "").trim();
  return n ? `LYC ${n}` : "LYC";
}

export function fleetNum(frota: string): string {
  return frota.replace(/^LYC[-\s]*/i, "").replace(/\s+/g, "").trim();
}

export function fmtKg(n: number): string {
  return `${n.toLocaleString("pt-BR")} kg`;
}

export function parsePeso(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export function isStandardTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function blankCarga(date: string, oc: string): Carga {
  return {
    id: `u-${crypto.randomUUID()}`,
    kind: "carga",
    date,
    veiculo: "Caminhão",
    material: "bica",
    servico: "Pulmão",
    frota: "",
    placa: "",
    nf: "",
    peso: 0,
    chegou: "",
    descarga: "",
    local: "CANTEIRO",
    horaPf: "",
    oc,
    preset: false,
  };
}

export function blankMeioFio(date: string): MeioFio {
  return {
    id: `u-${crypto.randomUUID()}`,
    kind: "meio_fio",
    date,
    frota: "",
    chegada: "",
    iniciou: "",
    terminou: "",
    estacaDe: "",
    estacaAte: "",
    lado: "DIREITO",
    obs: "",
    preset: false,
  };
}

export function suggestOc(entries: Entry[]): string {
  const cargas = entries.filter((e): e is Carga => e.kind === "carga" && e.oc.trim() !== "");
  if (!cargas.length) return OCS[OCS.length - 1];
  return [...cargas].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))[0]!.oc;
}

export function entryIssues(entry: Entry): string | null {
  if (entry.kind === "meio_fio") {
    const bad = [entry.chegada, entry.iniciou, entry.terminou].some((t) => t && !isStandardTime(t));
    if (bad) return "Horário fora do padrão HH:MM";
    if (
      isStandardTime(entry.iniciou) &&
      isStandardTime(entry.terminou) &&
      entry.terminou < entry.iniciou
    ) {
      return "Término antes do início";
    }
    return null;
  }
  const bad = [entry.chegou, entry.descarga, entry.horaPf].some((t) => t && !isStandardTime(t));
  return bad ? "Horário fora do padrão HH:MM" : null;
}

export const MATERIAIS: Material[] = ["bica", "saibro"];
export const VEICULOS: Veiculo[] = ["Caminhão", "Carreta"];
export const LADOS: Lado[] = ["DIREITO", "ESQUERDO"];
