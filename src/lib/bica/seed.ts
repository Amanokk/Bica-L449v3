import type { Carga, Entry, Lado, Material, MeioFio, Veiculo } from "./types";

const A = "2026-08-19";
const B = "2026-08-24";
const C = "2026-08-25";
const D = "2026-08-28";
const E = "2026-09-02";
const F = "2026-09-03";
const G = "2026-09-17";
const H = "2026-09-18";

const V = "Rua Visconde de Itaboraí";
const P = "Rua Prefeito Augusto de Andrade";
const K = "CANTEIRO";

const o1 = "154.951";
const o2 = "155.733";
const o3 = "155.892";
const o4 = "157.742";
const o5 = "157.838";

function c(
  date: string,
  veiculo: Veiculo,
  material: Material,
  servico: string,
  frota: string,
  placa: string,
  nf: string,
  peso: number,
  chegou: string,
  descarga: string,
  local: string,
  horaPf: string,
  oc: string,
): Carga {
  return {
    id: `c-${date}-${nf}-${frota}`,
    kind: "carga",
    date,
    veiculo,
    material,
    servico,
    frota,
    placa,
    nf,
    peso,
    chegou,
    descarga,
    local,
    horaPf,
    oc,
    preset: true,
  };
}

function m(
  date: string,
  frota: string,
  chegada: string,
  iniciou: string,
  terminou: string,
  estacaDe: string,
  estacaAte: string,
  lado: Lado,
  obs: string,
): MeioFio {
  return {
    id: `m-${date}-${frota}-${chegada.replace(":", "")}`,
    kind: "meio_fio",
    date,
    frota,
    chegada,
    iniciou,
    terminou,
    estacaDe,
    estacaAte,
    lado,
    obs,
    preset: true,
  };
}

export const SEED: Entry[] = [
  c(A, "Caminhão", "bica", "para base", "241", "RQN6A88", "10565", 29320, "09:11", "09:21", V, "08:18", o1),
  c(A, "Caminhão", "bica", "para base", "247", "RQP9D26", "10566", 28940, "09:11", "09:23", V, "08:28", o1),
  c(A, "Caminhão", "bica", "para base", "255", "RQO6C23", "10568", 29720, "09:29", "09:33", V, "08:47", o1),
  c(A, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "10567", 29650, "09:39", "09:42", K, "08:35", o1),
  c(A, "Caminhão", "bica", "Pulmão", "243", "RQN6A52", "10569", 29680, "10:08", "10:12", K, "09:09", o1),
  c(A, "Caminhão", "bica", "para base", "247", "RQP9D26", "10575", 29230, "11:18", "11:41", V, "10:28", o1),
  c(A, "Caminhão", "bica", "para base", "241", "RQN6A88", "10576", 27210, "11:26", "11:34", V, "10:43", o1),
  c(A, "Caminhão", "bica", "para base", "255", "RQO6C23", "10578", 28840, "11:27", "11:38", V, "10:50", o1),
  c(A, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "10579", 28480, "11:34", "11:37", K, "10:56", o1),

  c(B, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10647", 27320, "09:27", "09:32", K, "08:09", o1),
  c(B, "Caminhão", "bica", "para base", "241", "RQN6A88", "10651", 28400, "11:30", "11:36", V, "10:54", o2),
  c(B, "Caminhão", "bica", "Pulmão", "255", "RQO6C23", "10652", 27550, "11:49", "11:55", K, "11:02", o2),
  c(B, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "10656", 28690, "13:50", "13:57", K, "11:42", o2),
  c(B, "Caminhão", "bica", "Pulmão", "247", "RQP9D26", "10663", 28250, "14:38", "14:43", K, "13:54", o2),
  c(B, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10668", 27610, "15:27", "15:33", K, "14:22", o2),
  c(B, "Caminhão", "bica", "Pulmão", "243", "RQN6A52", "10669", 27650, "15:30", "15:36", K, "14:28", o2),

  c(C, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10674", 28120, "08:20", "08:26", K, "07:37", o2),
  c(C, "Caminhão", "saibro", "canteiro", "255", "RQO6C23", "10690", 24380, "09:34", "09:40", K, "08:46", o3),
  c(C, "Caminhão", "saibro", "para sub leito", "249", "RBJ6F60", "10687", 23810, "09:46", "09:50", P, "08:39", o3),
  c(C, "Caminhão", "saibro", "canteiro", "243", "RQN6A52", "10703", 23850, "09:57", "10:02", K, "09:03", o3),
  c(C, "Caminhão", "saibro", "canteiro", "241", "RQN6A88", "10682", 25590, "10:30", "10:36", K, "09:48", o3),
  c(C, "Caminhão", "saibro", "canteiro", "247", "RQP9D26", "10688", 24860, "09:41", "09:46", K, "08:42", o3),

  c(D, "Caminhão", "bica", "para sub base", "247", "RQP9D26", "10787", 28590, "09:55", "09:59", P, "09:12", o3),
  c(D, "Caminhão", "bica", "para sub base", "249", "RBJ6F60", "10788", 27190, "10:13", "10:17", P, "09:21", o3),
  c(D, "Caminhão", "bica", "para sub base", "243", "RQN6A52", "10789", 26790, "10:27", "10:32", P, "09:31", o3),
  c(D, "Caminhão", "bica", "para sub base", "276", "SFX7G09", "10790", 28040, "10:27", "10:32", P, "09:43", o3),
  c(D, "Caminhão", "bica", "para sub base", "243", "RQN6A52", "10798", 28750, "14:52", "14:54", P, "14:11", o3),
  c(D, "Caminhão", "bica", "para sub base", "249", "RBJ6F60", "10800", 28130, "14:52", "14:59", P, "14:18", o3),
  c(D, "Caminhão", "bica", "para sub base", "241", "RQN6A88", "10803", 28920, "15:11", "15:14", P, "14:38", o3),
  c(D, "Caminhão", "bica", "para sub base", "276", "SFX7G09", "10801", 29020, "15:11", "15:16", P, "14:28", o3),
  c(D, "Caminhão", "bica", "para sub base", "247", "RQP9D26", "10803", 29520, "15:12", "15:19", P, "14:43", o3),

  c(E, "Caminhão", "bica", "Pulmão", "247", "RQP9D26", "10878", 29750, "13:13", "13:15", K, "13:15", o2),
  c(E, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10879", 27890, "13:13", "13:16", K, "13:22", o2),
  c(E, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "10882", 29730, "14:10", "14:15", K, "12:00", o2),
  c(E, "Caminhão", "bica", "Pulmão", "249", "RBJ6F60", "10883", 28750, "14:28", "14:32", K, "13:43", o2),
  c(E, "Caminhão", "bica", "Pulmão", "255", "RQO6C23", "10884", 27850, "14:44", "14:48", K, "13:49", o2),
  c(E, "Carreta", "bica", "Pulmão", "128", "KQT9A95", "10888", 34670, "15:46", "15:50", K, "14:58", o2),
  c(E, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10887", 29360, "15:50", "15:56", K, "14:45", o2),
  c(E, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "10891", 27830, "16:28", "16:33", K, "15:33", o2),
  c(E, "Carreta", "bica", "Pulmão", "159", "KPP4G22", "10889", 37940, "16:04", "16:08", K, "15:17", o2),
  c(E, "Carreta", "bica", "Pulmão", "156", "KWC9J23", "10890", 33650, "16:19", "16:24", K, "15:24", o2),

  m(F, "88", "08:40", "08:47", "09:33", "166", "170", "DIREITO", "corrente da estrusora LYC - 172 soltou"),
  m(F, "88", "11:50", "11:59", "11:24", "166", "170", "ESQUERDO", ""),
  m(F, "162", "12:45", "12:55", "13:35", "170", "174", "ESQUERDO", ""),
  c(F, "Caminhão", "bica", "Pulmão", "249", "RBJ6F60", "10911", 27760, "15:57", "16:00", K, "15:06", o2),
  c(F, "Caminhão", "bica", "Pulmão", "255", "RQO6C23", "10910", 25330, "15:57", "16:01", K, "14:58", o2),
  c(F, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "10914", 28190, "16:09", "16:12", K, "15:25", o2),

  c(G, "Caminhão", "bica", "Pulmão", "255", "RQO6C23", "11009", 28430, "12:54", "12:58", K, "12:10", o4),
  c(G, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "11010", 30320, "12:54", "13:00", K, "12:15", o4),
  c(G, "Caminhão", "bica", "Pulmão", "275", "SFX7F89", "11020", 30890, "16:10", "16:14", K, "15:21", o4),
  c(G, "Caminhão", "bica", "Pulmão", "247", "RQP9D26", "11022", 29220, "16:12", "16:19", K, "15:37", o4),
  c(G, "Caminhão", "bica", "Pulmão", "255", "RQO6C23", "11027", 29140, "16:28", "16:31", K, "16:01", o4),
  c(G, "Caminhão", "bica", "Pulmão", "276", "SFX7GO9", "11026", 25600, "16:28", "16:32", K, "15:55", o4),
  c(G, "Caminhão", "bica", "Pulmão", "241", "RQN6A88", "11028", 29080, "16:47", "16:50", K, "16:053", o4),

  c(H, "Caminhão", "bica", "Pulmão", "249", "RBJ6F60", "11043", 29100, "11:00", "11:07", K, "10:07", o5),
  c(H, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "13835", 30270, "10:54", "10:59", K, "10:01", o5),
  c(H, "Caminhão", "bica", "Pulmão", "243", "RQN6A52", "11049", 30390, "11:28", "11:32", K, "10:54", o5),
  c(H, "Caminhão", "bica", "Pulmão", "276", "SFX7G09", "11058", 28770, "14:48", "14:53", K, "14:07", o5),
  c(H, "Caminhão", "bica", "Pulmão", "249", "RBJ6F60", "11059", 28750, "14:48", "14:54", K, "14:18", o5),
  c(H, "Caminhão", "bica", "Pulmão", "243", "RQN6A52", "11057", 27160, "14:48", "14:53", K, "13:58", o5),
];

export const LATEST_DATE = H;
