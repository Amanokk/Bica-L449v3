import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Plus, c as Clock, i as RotateCcw, l as Check, n as Truck, o as Pencil, s as Copy, t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BbZFw1_p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SERVICOS = [
	"para base",
	"Pulmão",
	"para sub base",
	"para sub leito",
	"canteiro"
];
var LOCAIS = [
	"CANTEIRO",
	"Rua Visconde de Itaboraí",
	"Rua Prefeito Augusto de Andrade"
];
var OCS = [
	"154.951",
	"155.733",
	"155.892",
	"157.742",
	"157.838"
];
var FLEET = [
	{
		frota: "241",
		placa: "RQN6A88",
		veiculo: "Caminhão"
	},
	{
		frota: "243",
		placa: "RQN6A52",
		veiculo: "Caminhão"
	},
	{
		frota: "247",
		placa: "RQP9D26",
		veiculo: "Caminhão"
	},
	{
		frota: "249",
		placa: "RBJ6F60",
		veiculo: "Caminhão"
	},
	{
		frota: "255",
		placa: "RQO6C23",
		veiculo: "Caminhão"
	},
	{
		frota: "275",
		placa: "SFX7F89",
		veiculo: "Caminhão"
	},
	{
		frota: "276",
		placa: "SFX7G09",
		veiculo: "Caminhão"
	},
	{
		frota: "128",
		placa: "KQT9A95",
		veiculo: "Carreta"
	},
	{
		frota: "156",
		placa: "KWC9J23",
		veiculo: "Carreta"
	},
	{
		frota: "159",
		placa: "KPP4G22",
		veiculo: "Carreta"
	},
	{
		frota: "88",
		placa: "",
		veiculo: "Caminhão"
	},
	{
		frota: "162",
		placa: "",
		veiculo: "Caminhão"
	}
];
function localForServico(servico) {
	if (servico === "para base") return "Rua Visconde de Itaboraí";
	if (servico === "para sub base" || servico === "para sub leito") return "Rua Prefeito Augusto de Andrade";
	return "CANTEIRO";
}
function brDate(iso) {
	const [, m, d] = iso.split("-");
	if (!d || !m) return iso;
	return `${d}/${m}`;
}
function weekday(iso) {
	const dt = /* @__PURE__ */ new Date(`${iso}T12:00:00`);
	if (Number.isNaN(dt.getTime())) return "";
	return dt.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}
function fleetLabel(frota) {
	const n = frota.replace(/^LYC[-\s]*/i, "").trim();
	return n ? `LYC ${n}` : "LYC";
}
function fleetNum(frota) {
	return frota.replace(/^LYC[-\s]*/i, "").replace(/\s+/g, "").trim();
}
function fmtKg(n) {
	return `${n.toLocaleString("pt-BR")} kg`;
}
function parsePeso(raw) {
	const digits = raw.replace(/\D/g, "");
	if (!digits) return 0;
	const n = Number(digits);
	return Number.isFinite(n) ? n : 0;
}
function isStandardTime(value) {
	return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
function blankCarga(date, oc) {
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
		preset: false
	};
}
function blankMeioFio(date) {
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
		preset: false
	};
}
function suggestOc(entries) {
	const cargas = entries.filter((e) => e.kind === "carga" && e.oc.trim() !== "");
	if (!cargas.length) return OCS[OCS.length - 1];
	return [...cargas].sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)[0].oc;
}
function entryIssues(entry) {
	if (entry.kind === "meio_fio") {
		if ([
			entry.chegada,
			entry.iniciou,
			entry.terminou
		].some((t) => t && !isStandardTime(t))) return "Horário fora do padrão HH:MM";
		if (isStandardTime(entry.iniciou) && isStandardTime(entry.terminou) && entry.terminou < entry.iniciou) return "Término antes do início";
		return null;
	}
	return [
		entry.chegou,
		entry.descarga,
		entry.horaPf
	].some((t) => t && !isStandardTime(t)) ? "Horário fora do padrão HH:MM" : null;
}
var MATERIAIS = ["bica", "saibro"];
var VEICULOS = ["Caminhão", "Carreta"];
var LADOS = ["DIREITO", "ESQUERDO"];
function heading(entry) {
	if (entry.servico === "Pulmão" || entry.servico === "canteiro") return `${entry.veiculo} de ${entry.material} ${entry.servico}`;
	return `${entry.veiculo} de ${entry.material} ${entry.servico}`;
}
function shortServico(servico) {
	return servico.replace(/^para\s+/i, "");
}
function shortLocal(local) {
	return local.replace(/^Rua\s+/i, "");
}
function timeKey(entry) {
	const match = (entry.kind === "carga" ? entry.chegou : entry.chegada).match(/(\d{1,2}):(\d{2})/);
	if (!match) return "99:99";
	return `${match[1].padStart(2, "0")}:${match[2]}`;
}
function compareEntry(a, b) {
	if (a.date !== b.date) return a.date < b.date ? -1 : 1;
	const ta = timeKey(a);
	const tb = timeKey(b);
	if (ta !== tb) return ta < tb ? -1 : 1;
	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
function formatEntry(entry) {
	if (entry.kind === "meio_fio") return formatMeioFio(entry);
	return [
		`*${heading(entry)}*`,
		fleetLabel(entry.frota),
		entry.placa.trim() ? `Placa ${entry.placa.trim().toUpperCase()}` : "",
		entry.nf.trim() ? `NOTA FISCAL ${entry.nf.trim()}` : "",
		entry.peso > 0 ? `PESO ${entry.peso}` : "",
		`CHEGOU - ${entry.chegou || "—"}`,
		`Descarga - ${entry.descarga || "—"}`,
		entry.local.trim(),
		`HORA PF - ${entry.horaPf || "—"}`,
		entry.oc.trim() ? `OC - ${entry.oc.trim()}` : ""
	].filter(Boolean).join("\n");
}
function formatMeioFio(entry) {
	return [
		`*CONCRETO MEIO FIO LYC-${fleetNum(entry.frota)}*`,
		`CHEGADA - ${entry.chegada || "—"}`,
		`INICIOU - ${entry.iniciou || "—"}`,
		`TERMINOU - ${entry.terminou || "—"}`,
		entry.estacaDe || entry.estacaAte ? `ESTACA - ${entry.estacaDe} - ${entry.estacaAte}` : "",
		entry.lado ? `LADO ${entry.lado}` : "",
		entry.obs.trim() ? `Obs - ${entry.obs.trim()}` : ""
	].filter(Boolean).join("\n");
}
function scheduleLine(entry) {
	if (entry.kind === "meio_fio") {
		const lado = entry.lado === "DIREITO" ? "LD" : entry.lado === "ESQUERDO" ? "LE" : "";
		return [
			fleetLabel(entry.frota),
			"meio-fio",
			`chegada ${entry.chegada || "—"}`,
			`iniciou ${entry.iniciou || "—"}`,
			`terminou ${entry.terminou || "—"}`,
			entry.estacaDe || entry.estacaAte ? `estaca ${entry.estacaDe}-${entry.estacaAte}` : "",
			lado
		].filter(Boolean).join(" · ");
	}
	return [
		fleetLabel(entry.frota),
		entry.material,
		shortServico(entry.servico),
		`PF ${entry.horaPf || "—"}`,
		`chegou ${entry.chegou || "—"}`,
		`descarga ${entry.descarga || "—"}`,
		shortLocal(entry.local)
	].join(" · ");
}
function dayTitle(date, entries) {
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
function renderSchedule(entries) {
	const sorted = [...entries].sort(compareEntry);
	const dates = [];
	const map = /* @__PURE__ */ new Map();
	for (const entry of sorted) {
		if (!map.has(entry.date)) {
			map.set(entry.date, []);
			dates.push(entry.date);
		}
		map.get(entry.date).push(entry);
	}
	return dates.map((date) => {
		const day = map.get(date);
		return `HORÁRIOS ${brDate(date)}\n${day.map(scheduleLine).join("\n")}`;
	}).join("\n\n");
}
function renderMessage(entries, schedule) {
	if (!entries.length) return "";
	const sorted = [...entries].sort(compareEntry);
	const dates = [];
	const map = /* @__PURE__ */ new Map();
	for (const entry of sorted) {
		if (!map.has(entry.date)) {
			map.set(entry.date, []);
			dates.push(entry.date);
		}
		map.get(entry.date).push(entry);
	}
	return dates.map((date) => {
		const day = map.get(date);
		const body = day.map(formatEntry).join("\n\n");
		const extra = schedule ? `\n\nHORÁRIOS\n${day.map(scheduleLine).join("\n")}` : "";
		return `${dayTitle(date, day)}\n\n${body}${extra}`;
	}).join("\n\n");
}
var A = "2026-08-19";
var B = "2026-08-24";
var C = "2026-08-25";
var D = "2026-08-28";
var E = "2026-09-02";
var F = "2026-09-03";
var G = "2026-09-17";
var H = "2026-09-18";
var V = "Rua Visconde de Itaboraí";
var P = "Rua Prefeito Augusto de Andrade";
var K = "CANTEIRO";
var o1 = "154.951";
var o2 = "155.733";
var o3 = "155.892";
var o4 = "157.742";
var o5 = "157.838";
function c(date, veiculo, material, servico, frota, placa, nf, peso, chegou, descarga, local, horaPf, oc) {
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
		preset: true
	};
}
function m(date, frota, chegada, iniciou, terminou, estacaDe, estacaAte, lado, obs) {
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
		preset: true
	};
}
var SEED = [
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
	c(H, "Caminhão", "bica", "Pulmão", "243", "RQN6A52", "11057", 27160, "14:48", "14:53", K, "13:58", o5)
];
var LATEST_DATE = H;
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var useBica = create()(persist((set) => ({
	entries: SEED,
	selected: SEED.filter((entry) => entry.date === LATEST_DATE).map((entry) => entry.id),
	includeSchedule: true,
	toggle: (id) => set((state) => ({ selected: state.selected.includes(id) ? state.selected.filter((item) => item !== id) : [...state.selected, id] })),
	setSelected: (ids) => set({ selected: [...new Set(ids)] }),
	clearSelected: () => set({ selected: [] }),
	upsert: (entry) => set((state) => {
		return {
			entries: state.entries.some((item) => item.id === entry.id) ? state.entries.map((item) => item.id === entry.id ? entry : item) : [...state.entries, entry],
			selected: state.selected.includes(entry.id) ? state.selected : [...state.selected, entry.id]
		};
	}),
	remove: (id) => set((state) => ({
		entries: state.entries.filter((entry) => entry.id !== id),
		selected: state.selected.filter((item) => item !== id)
	})),
	setIncludeSchedule: (value) => set({ includeSchedule: value }),
	resetPresets: () => set((state) => {
		const custom = state.entries.filter((entry) => !entry.preset);
		const entries = [...SEED, ...custom];
		const ids = new Set(entries.map((entry) => entry.id));
		return {
			entries,
			selected: state.selected.filter((id) => ids.has(id))
		};
	})
}), {
	name: "bica-l449-v1",
	skipHydration: true,
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : window.localStorage)
}));
var FILTERS = [
	{
		id: "todos",
		label: "Todos"
	},
	{
		id: "bica",
		label: "Bica"
	},
	{
		id: "saibro",
		label: "Saibro"
	},
	{
		id: "meio_fio",
		label: "Meio-fio"
	},
	{
		id: "carreta",
		label: "Carreta"
	}
];
function matchesFilter(entry, filter, query) {
	if (filter === "bica" && !(entry.kind === "carga" && entry.material === "bica")) return false;
	if (filter === "saibro" && !(entry.kind === "carga" && entry.material === "saibro")) return false;
	if (filter === "meio_fio" && entry.kind !== "meio_fio") return false;
	if (filter === "carreta" && !(entry.kind === "carga" && entry.veiculo === "Carreta")) return false;
	const q = query.trim().toLocaleLowerCase("pt-BR");
	if (!q) return true;
	return (entry.kind === "carga" ? [
		entry.frota,
		entry.placa,
		entry.nf,
		entry.local,
		entry.oc,
		entry.servico,
		entry.material,
		entry.veiculo
	] : [
		entry.frota,
		entry.lado,
		entry.obs,
		"meio fio",
		entry.estacaDe,
		entry.estacaAte
	]).join(" ").toLocaleLowerCase("pt-BR").includes(q);
}
function BicaApp() {
	const entries = useBica((s) => s.entries);
	const selected = useBica((s) => s.selected);
	const includeSchedule = useBica((s) => s.includeSchedule);
	const toggle = useBica((s) => s.toggle);
	const setSelected = useBica((s) => s.setSelected);
	const clearSelected = useBica((s) => s.clearSelected);
	const upsert = useBica((s) => s.upsert);
	const remove = useBica((s) => s.remove);
	const setIncludeSchedule = useBica((s) => s.setIncludeSchedule);
	const resetPresets = useBica((s) => s.resetPresets);
	const [date, setDate] = (0, import_react.useState)("2026-09-18");
	const [filter, setFilter] = (0, import_react.useState)("todos");
	const [query, setQuery] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [formMode, setFormMode] = (0, import_react.useState)("create");
	const [formError, setFormError] = (0, import_react.useState)("");
	const [pesoText, setPesoText] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [copyState, setCopyState] = (0, import_react.useState)("");
	const [override, setOverride] = (0, import_react.useState)(null);
	const [overrideFor, setOverrideFor] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		useBica.persist.rehydrate();
	}, []);
	const dates = (0, import_react.useMemo)(() => {
		return [...new Set(entries.map((entry) => entry.date))].sort();
	}, [entries]);
	const visible = (0, import_react.useMemo)(() => {
		return entries.filter((entry) => date === "todas" ? true : entry.date === date).filter((entry) => matchesFilter(entry, filter, query)).sort(compareEntry);
	}, [
		entries,
		date,
		filter,
		query
	]);
	const selectedEntries = (0, import_react.useMemo)(() => entries.filter((entry) => selected.includes(entry.id)), [entries, selected]);
	const generated = (0, import_react.useMemo)(() => renderMessage(selectedEntries, includeSchedule !== false), [selectedEntries, includeSchedule]);
	const scheduleOnly = (0, import_react.useMemo)(() => renderSchedule(selectedEntries), [selectedEntries]);
	const textValue = overrideFor === generated ? override ?? generated : generated;
	const peso = selectedEntries.reduce((sum, entry) => sum + (entry.kind === "carga" ? entry.peso : 0), 0);
	const visibleIds = visible.map((entry) => entry.id);
	const visibleSelected = visibleIds.filter((id) => selected.includes(id)).length;
	function openInsert() {
		const next = blankCarga(date !== "todas" ? date : dates[dates.length - 1] ?? "2026-09-18", suggestOc(entries));
		setPesoText("");
		setFormError("");
		setFormMode("create");
		setDraft(next);
	}
	function openEdit(entry) {
		setFormError("");
		setFormMode("edit");
		setPesoText(entry.kind === "carga" && entry.peso ? String(entry.peso) : "");
		setDraft(structuredClone(entry));
		setConfirmId(null);
	}
	function saveDraft() {
		if (!draft) return;
		if (!draft.date) {
			setFormError("Informe a data.");
			return;
		}
		if (!fleetNum(draft.frota)) {
			setFormError("Informe a frota. Pode escolher da lista ou digitar.");
			return;
		}
		if (draft.kind === "carga") {
			const peso = parsePeso(pesoText);
			if (!draft.nf.trim()) {
				setFormError("Informe a nota fiscal.");
				return;
			}
			if (peso <= 0) {
				setFormError("Informe o peso.");
				return;
			}
			if (!draft.chegou || !draft.descarga || !draft.horaPf) {
				setFormError("Preencha chegou, descarga e hora PF.");
				return;
			}
			upsert({
				...draft,
				frota: fleetNum(draft.frota),
				placa: draft.placa.trim().toUpperCase(),
				nf: draft.nf.trim(),
				peso,
				oc: draft.oc.trim(),
				local: draft.local.trim()
			});
		} else {
			if (!draft.chegada || !draft.iniciou || !draft.terminou) {
				setFormError("Preencha chegada, início e término.");
				return;
			}
			upsert({
				...draft,
				frota: fleetNum(draft.frota),
				obs: draft.obs.trim()
			});
		}
		if (date !== "todas") setDate(draft.date);
		setDraft(null);
	}
	async function copyText(value) {
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			setCopyState("Copiado");
		} catch {
			const area = document.getElementById("texto-bica");
			if (area) {
				area.focus();
				area.select();
			}
			const ok = document.execCommand("copy");
			setCopyState(ok ? "Copiado" : "Selecione o texto e copie");
		}
		window.setTimeout(() => setCopyState(""), 1800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen overflow-x-hidden bg-paper pb-24 text-ink lg:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid min-w-0 max-w-6xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-6 lg:py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
									children: "Obra L449"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 text-3xl font-semibold tracking-tight",
									children: "Bica"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-xl text-sm leading-relaxed text-muted",
									children: "Escolha os lançamentos ou insira um novo. O texto sai no formato do WhatsApp, com chegada, descarga e hora PF."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: openInsert,
								className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Inserir"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2 overflow-x-auto pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateChip, {
								active: date === "todas",
								onClick: () => setDate("todas"),
								label: "Todos os dias"
							}), dates.map((iso) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateChip, {
								active: date === iso,
								onClick: () => setDate(iso),
								label: brDate(iso),
								hint: weekday(iso),
								count: entries.filter((entry) => entry.date === iso).length
							}, iso))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": filter === item.id,
								onClick: () => setFilter(item.id),
								className: filter === item.id ? "h-10 rounded-full bg-ink px-3 text-sm font-medium text-paper" : "h-10 rounded-full border border-line bg-card px-3 text-sm font-medium text-ink",
								children: item.label
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Buscar lançamento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Buscar frota, placa, NF, rua ou OC",
								className: "h-11 w-full rounded-md border border-line bg-card px-3 text-base text-ink outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelected(visibleIds),
									className: "h-10 rounded-md border border-line bg-card px-3 text-sm font-medium",
									children: [
										"Marcar estes (",
										visible.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: clearSelected,
									className: "h-10 rounded-md px-3 text-sm font-medium text-muted",
									children: "Limpar marcação"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: resetPresets,
									className: "inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), "Restaurar lista"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "ml-auto text-sm text-muted tabular-nums",
									children: [visibleSelected, " visíveis marcados"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex flex-col gap-3",
							children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-lg border border-dashed border-line bg-card px-4 py-8 text-center text-sm text-muted",
								children: "Nenhum lançamento com esse filtro. Insira um novo ou troque o dia."
							}) : visible.map((entry, index) => {
								const showHead = date === "todas" && (index === 0 || visible[index - 1].date !== entry.date);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [showHead ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mt-2 mb-2 text-sm font-semibold",
									children: [
										brDate(entry.date),
										" · ",
										weekday(entry.date)
									]
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
									entry,
									checked: selected.includes(entry.id),
									confirming: confirmId === entry.id,
									onToggle: () => toggle(entry.id),
									onEdit: () => openEdit(entry),
									onAskDelete: () => setConfirmId(entry.id),
									onCancelDelete: () => setConfirmId(null),
									onDelete: () => {
										remove(entry.id);
										setConfirmId(null);
									}
								})] }, entry.id);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextPanel, {
					text: textValue,
					edited: overrideFor === generated && override != null && override !== generated,
					schedule: scheduleOnly,
					count: selectedEntries.length,
					peso,
					includeSchedule: includeSchedule !== false,
					copyState,
					onToggleSchedule: setIncludeSchedule,
					onChange: (value) => {
						setOverride(value);
						setOverrideFor(generated);
					},
					onReset: () => {
						setOverride(null);
						setOverrideFor("");
					},
					onCopy: () => void copyText(textValue),
					onCopySchedule: () => void copyText(scheduleOnly)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card px-4 py-3 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !textValue,
					onClick: () => void copyText(textValue),
					className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper disabled:opacity-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						"aria-hidden": "true"
					}), copyState || `Copiar texto (${selectedEntries.length})`]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: draft != null,
				onOpenChange: (open) => !open && setDraft(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "fixed inset-x-0 bottom-0 z-50 max-h-dvh overflow-y-auto rounded-t-xl border border-line bg-paper p-4 sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-6",
					children: draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryForm, {
						draft,
						mode: formMode,
						pesoText,
						error: formError,
						onPeso: setPesoText,
						onChange: (next) => {
							setFormError("");
							setDraft(next);
						},
						onClose: () => setDraft(null),
						onSave: saveDraft
					}) : null
				})] })
			})
		]
	});
}
function DateChip({ active, label, hint, count, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": active,
		className: active ? "min-h-14 shrink-0 rounded-md bg-accent px-3 py-2 text-left text-paper" : "min-h-14 shrink-0 rounded-md border border-line bg-card px-3 py-2 text-left text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-semibold leading-none",
			children: label
		}), hint || count != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: active ? "mt-1 block text-xs text-paper/80" : "mt-1 block text-xs text-muted",
			children: [
				hint ?? "",
				hint && count != null ? " · " : "",
				count != null ? count : ""
			]
		}) : null]
	});
}
function EntryCard({ entry, checked, confirming, onToggle, onEdit, onAskDelete, onCancelDelete, onDelete }) {
	const issue = entryIssues(entry);
	const title = entry.kind === "carga" ? heading(entry) : "Concreto meio-fio";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: checked ? "rounded-lg border border-accent bg-accent-soft" : "rounded-lg border border-line bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-1 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-1 cursor-pointer gap-3 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked,
						onChange: onToggle,
						"aria-label": `Marcar ${fleetLabel(entry.frota)}`,
						className: "mt-1 size-5 shrink-0 accent-accent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex flex-wrap items-baseline gap-x-2 gap-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-base font-medium tabular-nums",
									children: fleetLabel(entry.frota)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm text-ink",
								children: entry.kind === "carga" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									entry.placa || "sem placa",
									" · NF ",
									entry.nf || "—",
									" · ",
									fmtKg(entry.peso)
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Estaca ",
									entry.estacaDe,
									"–",
									entry.estacaAte,
									entry.lado ? ` · lado ${entry.lado.toLocaleLowerCase("pt-BR")}` : ""
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-0.5 block truncate text-sm text-muted",
								children: [brDate(entry.date), entry.kind === "carga" ? ` · ${entry.local} · OC ${entry.oc}` : entry.obs ? ` · ${entry.obs}` : ""]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onEdit,
					className: "mt-2 inline-flex size-11 items-center justify-center rounded-md text-ink",
					"aria-label": `Editar ${fleetLabel(entry.frota)}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
						className: "size-4",
						"aria-hidden": "true"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2 px-4 pb-4",
				children: entry.kind === "carga" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Hora PF",
						value: entry.horaPf
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Chegou",
						value: entry.chegou
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Descarga",
						value: entry.descarga
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Chegada",
						value: entry.chegada
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Iniciou",
						value: entry.iniciou
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
						label: "Terminou",
						value: entry.terminou
					})
				] })
			}),
			issue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 pb-3 text-sm text-danger",
				children: [issue, ". Vale conferir antes de copiar."]
			}) : null,
			confirming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-t border-line px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Excluir este lançamento?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onCancelDelete,
						className: "h-10 px-2 text-sm font-medium",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onDelete,
						className: "h-10 px-2 text-sm font-semibold text-danger",
						children: "Excluir"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-line px-4 py-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onAskDelete,
					className: "h-10 text-sm text-muted",
					children: "Excluir"
				})
			})
		]
	});
}
function TimeCell({ label, value }) {
	const odd = value !== "" && !isStandardTime(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm bg-paper px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: odd ? "font-mono text-base font-medium text-danger tabular-nums" : "font-mono text-base font-medium tabular-nums",
			children: value || "—"
		})]
	});
}
function TextPanel({ text, edited, schedule, count, peso, includeSchedule, copyState, onToggleSchedule, onChange, onReset, onCopy, onCopySchedule }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-line bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
						className: "size-4 text-accent",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold tracking-tight",
						children: "Texto"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted tabular-nums",
					children: count === 0 ? "Marque lançamentos para montar a mensagem." : `${count} ${count === 1 ? "lançamento" : "lançamentos"} · ${fmtKg(peso)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: includeSchedule,
						onChange: (event) => onToggleSchedule(event.target.checked),
						className: "mt-1 size-5 accent-accent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "size-3.5",
							"aria-hidden": "true"
						}), "Quadro de horários no final"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-sm text-muted",
						children: "Chegou, descarga e hora PF já entram em cada caminhão. Isto repete o quadro do dia."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "texto-bica",
					value: text,
					onChange: (event) => onChange(event.target.value),
					rows: 8,
					"aria-label": "Texto para copiar",
					placeholder: "O texto dos lançamentos marcados aparece aqui, com os horários.",
					className: "mt-3 w-full resize-y rounded-md border border-line bg-paper px-3 py-3 text-sm leading-relaxed text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				}),
				edited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onReset,
					className: "mt-2 h-10 text-sm font-semibold text-accent",
					children: "Voltar ao texto automático"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !text,
						onClick: onCopy,
						className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper disabled:opacity-40",
						children: [copyState === "Copiado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-4",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
							className: "size-4",
							"aria-hidden": "true"
						}), copyState || "Copiar texto"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !schedule,
						onClick: onCopySchedule,
						className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-semibold disabled:opacity-40",
						children: "Copiar só horários"
					})]
				})
			]
		})
	});
}
function EntryForm({ draft, mode, pesoText, error, onPeso, onChange, onClose, onSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (event) => {
			event.preventDefault();
			onSave();
		},
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-semibold tracking-tight",
					children: mode === "create" ? "Inserir lançamento" : "Editar lançamento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: "Escolha um dado da lista ou digite outro. Os horários entram no texto."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "inline-flex size-11 items-center justify-center rounded-md",
					"aria-label": "Fechar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						"aria-hidden": "true"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindButton, {
					active: draft.kind === "carga",
					label: "Caminhão ou carreta",
					onClick: () => {
						if (draft.kind === "carga") return;
						const next = blankCarga(draft.date, "157.838");
						next.id = draft.id;
						next.preset = draft.preset;
						next.frota = draft.frota;
						onChange(next);
						onPeso("");
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindButton, {
					active: draft.kind === "meio_fio",
					label: "Concreto meio-fio",
					onClick: () => {
						if (draft.kind === "meio_fio") return;
						const next = blankMeioFio(draft.date);
						next.id = draft.id;
						next.preset = draft.preset;
						next.frota = draft.frota;
						onChange(next);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Data",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						required: true,
						value: draft.date,
						onChange: (event) => onChange({
							...draft,
							date: event.target.value
						}),
						className: fieldClass
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Frota",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						list: "frotas-bica",
						required: true,
						value: draft.frota,
						placeholder: "241",
						onChange: (event) => {
							const raw = fleetNum(event.target.value);
							const hit = FLEET.find((item) => item.frota === raw);
							if (draft.kind === "carga") onChange({
								...draft,
								frota: event.target.value,
								placa: hit?.placa || draft.placa,
								veiculo: hit?.veiculo || draft.veiculo
							});
							else onChange({
								...draft,
								frota: event.target.value
							});
						},
						className: fieldClass
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
						id: "frotas-bica",
						children: FLEET.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.frota,
							children: item.placa ? `${fleetLabel(item.frota)} · ${item.placa}` : fleetLabel(item.frota)
						}, item.frota))
					})]
				})]
			}),
			draft.kind === "carga" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaFields, {
				draft,
				pesoText,
				onPeso,
				onChange
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeioFields, {
				draft,
				onChange
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "h-11 rounded-md px-3 text-sm font-medium",
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-11 rounded-md bg-accent px-4 text-sm font-semibold text-paper",
					children: "Salvar no texto"
				})]
			})
		]
	});
}
function CargaFields({ draft, pesoText, onPeso, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Veículo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: VEICULOS.map((veiculo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						active: draft.veiculo === veiculo,
						label: veiculo,
						onClick: () => onChange({
							...draft,
							veiculo
						})
					}, veiculo))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Material",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: MATERIAIS.map((material) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						active: draft.material === material,
						label: material,
						onClick: () => onChange({
							...draft,
							material
						})
					}, material))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Serviço",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: SERVICOS.map((servico) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					active: draft.servico === servico,
					label: servico,
					onClick: () => onChange({
						...draft,
						servico,
						local: localForServico(servico)
					})
				}, servico))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Placa",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						list: "placas-bica",
						value: draft.placa,
						placeholder: "RQN6A88",
						onChange: (event) => {
							const placa = event.target.value.toUpperCase();
							const hit = FLEET.find((item) => item.placa === placa.replace(/\s/g, ""));
							onChange({
								...draft,
								placa,
								frota: hit?.frota || draft.frota,
								veiculo: hit?.veiculo || draft.veiculo
							});
						},
						className: fieldClass
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
						id: "placas-bica",
						children: FLEET.filter((item) => item.placa).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.placa,
							children: fleetLabel(item.frota)
						}, item.placa))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nota fiscal",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						value: draft.nf,
						onChange: (event) => onChange({
							...draft,
							nf: event.target.value.replace(/\D/g, "")
						}),
						className: fieldClass
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Peso (kg)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						value: pesoText,
						placeholder: "29320",
						onChange: (event) => onPeso(event.target.value),
						className: fieldClass
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "OC",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						list: "ocs-bica",
						value: draft.oc,
						onChange: (event) => onChange({
							...draft,
							oc: event.target.value
						}),
						className: fieldClass
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
						id: "ocs-bica",
						children: OCS.map((oc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: oc }, oc))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hora PF",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.horaPf,
						onChange: (horaPf) => onChange({
							...draft,
							horaPf
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Chegou",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.chegou,
						onChange: (chegou) => onChange({
							...draft,
							chegou
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Descarga",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.descarga,
						onChange: (descarga) => onChange({
							...draft,
							descarga
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
			label: "Local",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				list: "locais-bica",
				value: draft.local,
				onChange: (event) => onChange({
					...draft,
					local: event.target.value
				}),
				className: fieldClass
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
				id: "locais-bica",
				children: LOCAIS.map((local) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: local }, local))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: [
				"Destino no texto: ",
				shortServico(draft.servico),
				" · ",
				draft.local || "sem local"
			]
		})
	] });
}
function MeioFields({ draft, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Chegada",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.chegada,
						onChange: (chegada) => onChange({
							...draft,
							chegada
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Iniciou",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.iniciou,
						onChange: (iniciou) => onChange({
							...draft,
							iniciou
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Terminou",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeInput, {
						value: draft.terminou,
						onChange: (terminou) => onChange({
							...draft,
							terminou
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Estaca de",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					value: draft.estacaDe,
					onChange: (event) => onChange({
						...draft,
						estacaDe: event.target.value.replace(/\D/g, "")
					}),
					className: fieldClass
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Estaca até",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					value: draft.estacaAte,
					onChange: (event) => onChange({
						...draft,
						estacaAte: event.target.value.replace(/\D/g, "")
					}),
					className: fieldClass
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Lado",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: LADOS.map((lado) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					active: draft.lado === lado,
					label: lado === "DIREITO" ? "Direito" : "Esquerdo",
					onClick: () => onChange({
						...draft,
						lado
					})
				}, lado))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Observação",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: draft.obs,
				rows: 3,
				onChange: (event) => onChange({
					...draft,
					obs: event.target.value
				}),
				className: "w-full rounded-sm border border-line bg-card px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
			})
		})
	] });
}
function TimeInput({ value, onChange }) {
	if (value && !isStandardTime(value)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		value,
		onChange: (event) => onChange(event.target.value),
		className: fieldClass,
		"aria-invalid": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "time",
		value,
		onChange: (event) => onChange(event.target.value),
		className: fieldClass
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-sm font-medium",
			children: label
		}), children]
	});
}
function Choice({ active, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: active ? "h-11 rounded-sm bg-ink px-3 text-sm font-medium text-paper" : "h-11 rounded-sm border border-line bg-card px-3 text-sm font-medium",
		children: label
	});
}
function KindButton({ active, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: active ? "h-11 rounded-sm bg-accent px-2 text-sm font-semibold text-paper" : "h-11 rounded-sm border border-line bg-card px-2 text-sm font-medium",
		children: label
	});
}
var fieldClass = "h-11 w-full rounded-sm border border-line bg-card px-3 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BicaApp, {});
}
//#endregion
export { Home as component };
