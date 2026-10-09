export type Veiculo = "Caminhão" | "Carreta";
export type Material = "bica" | "saibro";
export type Lado = "DIREITO" | "ESQUERDO" | "";

export type Carga = {
  id: string;
  kind: "carga";
  date: string;
  veiculo: Veiculo;
  material: Material;
  servico: string;
  frota: string;
  placa: string;
  nf: string;
  peso: number;
  chegou: string;
  descarga: string;
  local: string;
  horaPf: string;
  oc: string;
  preset: boolean;
};

export type MeioFio = {
  id: string;
  kind: "meio_fio";
  date: string;
  frota: string;
  chegada: string;
  iniciou: string;
  terminou: string;
  estacaDe: string;
  estacaAte: string;
  lado: Lado;
  obs: string;
  preset: boolean;
};

export type Entry = Carga | MeioFio;

export function isCarga(entry: Entry): entry is Carga {
  return entry.kind === "carga";
}
