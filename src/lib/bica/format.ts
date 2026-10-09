import { brDate, fleetLabel, fleetNum } from "./catalog";
import type { Carga, Entry, MeioFio } from "./types";

export function heading(entry: Carga): string {
  if (entry.servico === "Pulmão" || entry.servico === "canteiro") {
    return `${entry.veiculo} de ${entry.material} ${entry.servico}`;
  }
  return `${entry.veiculo} de ${entry.material} ${entry.servico}`;
}

export function shortServico(servico: string): string {
  return servico.replace(/^para\s+/i, "");
}

export function shortLocal(local: string): string {
  return local.replace(/^Rua\s+/i, "");
}

function timeKey(entry: Entry): string {
  const raw = entry.kind === "carga" ? entry.chegou : entry.chegada;
  const match = raw.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "99:99";
  return `${match[1]!.padStart(2, "0")}:${match[2]}`;
}

export function compareEntry(a: Entry, b: Entry): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const ta = timeKey(a);
  const tb = timeKey(b);
  if (ta !== tb) return ta < tb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

export function formatEntry(entry: Entry): string {
  if (entry.kind === "meio_fio") return formatMeioFio(entry);
  const lines = [
    `*${heading(entry)}*`,
    fleetLabel(entry.frota),
    entry.placa.trim() ? `Placa ${entry.placa.trim().toUpperCase()}` : "",
    entry.nf.trim() ? `NOTA FISCAL ${entry.nf.trim()}` : "",
    entry.peso > 0 ? `PESO ${entry.peso}` : "",
    `CHEGOU - ${entry.chegou || "—"}`,
    `Descarga - ${entry.descarga || "—"}`,
    entry.local.trim(),
    `HORA PF - ${entry.horaPf || "—"}`,
    entry.oc.trim() ? `OC - ${entry.oc.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function formatMeioFio(entry: MeioFio): string {
  const num = fleetNum(entry.frota);
  const lines = [
    `*CONCRETO MEIO FIO LYC-${num}*`,
    `CHEGADA - ${entry.chegada || "—"}`,
    `INICIOU - ${entry.iniciou || "—"}`,
    `TERMINOU - ${entry.terminou || "—"}`,
    entry.estacaDe || entry.estacaAte ? `ESTACA - ${entry.estacaDe} - ${entry.estacaAte}` : "",
    entry.lado ? `LADO ${entry.lado}` : "",
    entry.obs.trim() ? `Obs - ${entry.obs.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export function scheduleLine(entry: Entry): string {
  if (entry.kind === "meio_fio") {
    const lado = entry.lado === "DIREITO" ? "LD" : entry.lado === "ESQUERDO" ? "LE" : "";
    return [
      fleetLabel(entry.frota),
      "meio-fio",
      `chegada ${entry.chegada || "—"}`,
      `iniciou ${entry.iniciou || "—"}`,
      `terminou ${entry.terminou || "—"}`,
      entry.estacaDe || entry.estacaAte ? `estaca ${entry.estacaDe}-${entry.estacaAte}` : "",
      lado,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return [
    fleetLabel(entry.frota),
    entry.material,
    shortServico(entry.servico),
    `PF ${entry.horaPf || "—"}`,
    `chegou ${entry.chegou || "—"}`,
    `descarga ${entry.descarga || "—"}`,
    shortLocal(entry.local),
  ].join(" · ");
}

function dayTitle(date: string, entries: Entry[]): string {
  const label = brDate(date);
  const hasBica = entries.some((e) => e.kind === "carga" && e.material === "bica");
  const hasSaibro = entries.some((e) => e.kind === "carga" && e.material === "saibro");
  const hasMeio = entries.some((e) => e.kind === "meio_fio");
  if (hasMeio && !hasBica && !hasSaibro) return `CONCRETO MEIO FIO DIA ${label}`;
  if (hasBica && hasSaibro) return `CAMINHÕES DE BICA / SAIBRO ${label}`;
  if (hasSaibro) return `CAMINHÕES DE SAIBRO DIA ${label}`;
  if (hasBica && hasMeio) return `LANÇAMENTOS DIA ${label}`;
  if (hasBica) return `CAMINHÕES DE BICA DIA ${label}`;
  return `LANÇAMENTOS DIA ${label}`;
}

export function renderSchedule(entries: Entry[]): string {
  const sorted = [...entries].sort(compareEntry);
  const dates: string[] = [];
  const map = new Map<string, Entry[]>();
  for (const entry of sorted) {
    if (!map.has(entry.date)) {
      map.set(entry.date, []);
      dates.push(entry.date);
    }
    map.get(entry.date)!.push(entry);
  }
  return dates
    .map((date) => {
      const day = map.get(date)!;
      return `HORÁRIOS ${brDate(date)}\n${day.map(scheduleLine).join("\n")}`;
    })
    .join("\n\n");
}

export function renderMessage(entries: Entry[], schedule: boolean): string {
  if (!entries.length) return "";
  const sorted = [...entries].sort(compareEntry);
  const dates: string[] = [];
  const map = new Map<string, Entry[]>();
  for (const entry of sorted) {
    if (!map.has(entry.date)) {
      map.set(entry.date, []);
      dates.push(entry.date);
    }
    map.get(entry.date)!.push(entry);
  }
  return dates
    .map((date) => {
      const day = map.get(date)!;
      const body = day.map(formatEntry).join("\n\n");
      const extra = schedule ? `\n\nHORÁRIOS\n${day.map(scheduleLine).join("\n")}` : "";
      return `${dayTitle(date, day)}\n\n${body}${extra}`;
    })
    .join("\n\n");
}
