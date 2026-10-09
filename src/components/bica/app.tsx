import * as Dialog from "@radix-ui/react-dialog";
import { Check, Clock, Copy, Pencil, Plus, RotateCcw, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FLEET,
  LADOS,
  LOCAIS,
  MATERIAIS,
  OCS,
  SERVICOS,
  VEICULOS,
  blankCarga,
  blankMeioFio,
  brDate,
  entryIssues,
  fleetLabel,
  fleetNum,
  fmtKg,
  isStandardTime,
  localForServico,
  parsePeso,
  suggestOc,
  weekday,
} from "@/lib/bica/catalog";
import { compareEntry, heading, renderMessage, renderSchedule, shortServico } from "@/lib/bica/format";
import { useBica } from "@/lib/bica/store";
import type { Carga, Entry, Lado, Material, MeioFio } from "@/lib/bica/types";

type MaterialFilter = "todos" | "bica" | "saibro" | "meio_fio" | "carreta";

const FILTERS: { id: MaterialFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "bica", label: "Bica" },
  { id: "saibro", label: "Saibro" },
  { id: "meio_fio", label: "Meio-fio" },
  { id: "carreta", label: "Carreta" },
];

function matchesFilter(entry: Entry, filter: MaterialFilter, query: string): boolean {
  if (filter === "bica" && !(entry.kind === "carga" && entry.material === "bica")) return false;
  if (filter === "saibro" && !(entry.kind === "carga" && entry.material === "saibro")) return false;
  if (filter === "meio_fio" && entry.kind !== "meio_fio") return false;
  if (filter === "carreta" && !(entry.kind === "carga" && entry.veiculo === "Carreta")) return false;
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (!q) return true;
  const blob =
    entry.kind === "carga"
      ? [entry.frota, entry.placa, entry.nf, entry.local, entry.oc, entry.servico, entry.material, entry.veiculo]
      : [entry.frota, entry.lado, entry.obs, "meio fio", entry.estacaDe, entry.estacaAte];
  return blob.join(" ").toLocaleLowerCase("pt-BR").includes(q);
}

export function BicaApp() {
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

  const [date, setDate] = useState<string>("2026-09-18");
  const [filter, setFilter] = useState<MaterialFilter>("todos");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Entry | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formError, setFormError] = useState("");
  const [pesoText, setPesoText] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copyState, setCopyState] = useState("");
  const [override, setOverride] = useState<string | null>(null);
  const [overrideFor, setOverrideFor] = useState("");

  useEffect(() => {
    void useBica.persist.rehydrate();
  }, []);

  const dates = useMemo(() => {
    const set = new Set(entries.map((entry) => entry.date));
    return [...set].sort();
  }, [entries]);

  const visible = useMemo(() => {
    return entries
      .filter((entry) => (date === "todas" ? true : entry.date === date))
      .filter((entry) => matchesFilter(entry, filter, query))
      .sort(compareEntry);
  }, [entries, date, filter, query]);

  const selectedEntries = useMemo(
    () => entries.filter((entry) => selected.includes(entry.id)),
    [entries, selected],
  );

  const generated = useMemo(
    () => renderMessage(selectedEntries, includeSchedule !== false),
    [selectedEntries, includeSchedule],
  );
  const scheduleOnly = useMemo(() => renderSchedule(selectedEntries), [selectedEntries]);
  const textValue = overrideFor === generated ? (override ?? generated) : generated;

  const peso = selectedEntries.reduce((sum, entry) => sum + (entry.kind === "carga" ? entry.peso : 0), 0);
  const visibleIds = visible.map((entry) => entry.id);
  const visibleSelected = visibleIds.filter((id) => selected.includes(id)).length;

  function openInsert() {
    const day = date !== "todas" ? date : dates[dates.length - 1] ?? "2026-09-18";
    const next = blankCarga(day, suggestOc(entries));
    setPesoText("");
    setFormError("");
    setFormMode("create");
    setDraft(next);
  }

  function openEdit(entry: Entry) {
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
        local: draft.local.trim(),
      });
    } else {
      if (!draft.chegada || !draft.iniciou || !draft.terminou) {
        setFormError("Preencha chegada, início e término.");
        return;
      }
      upsert({ ...draft, frota: fleetNum(draft.frota), obs: draft.obs.trim() });
    }
    if (date !== "todas") setDate(draft.date);
    setDraft(null);
  }

  async function copyText(value: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("Copiado");
    } catch {
      const area = document.getElementById("texto-bica") as HTMLTextAreaElement | null;
      if (area) {
        area.focus();
        area.select();
      }
      const ok = document.execCommand("copy");
      setCopyState(ok ? "Copiado" : "Selecione o texto e copie");
    }
    window.setTimeout(() => setCopyState(""), 1800);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-paper pb-24 text-ink lg:pb-8">
      <div className="mx-auto grid min-w-0 max-w-6xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-6 lg:py-8">
        <section className="min-w-0">
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Obra L449</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Bica</h1>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                Escolha os lançamentos ou insira um novo. O texto sai no formato do WhatsApp, com chegada,
                descarga e hora PF.
              </p>
            </div>
            <button
              type="button"
              onClick={openInsert}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper"
            >
              <Plus className="size-4" aria-hidden="true" />
              Inserir
            </button>
          </header>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <DateChip active={date === "todas"} onClick={() => setDate("todas")} label="Todos os dias" />
            {dates.map((iso) => (
              <DateChip
                key={iso}
                active={date === iso}
                onClick={() => setDate(iso)}
                label={brDate(iso)}
                hint={weekday(iso)}
                count={entries.filter((entry) => entry.date === iso).length}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={
                  filter === item.id
                    ? "h-10 rounded-full bg-ink px-3 text-sm font-medium text-paper"
                    : "h-10 rounded-full border border-line bg-card px-3 text-sm font-medium text-ink"
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="mt-3 block">
            <span className="sr-only">Buscar lançamento</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar frota, placa, NF, rua ou OC"
              className="h-11 w-full rounded-md border border-line bg-card px-3 text-base text-ink outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(visibleIds)}
              className="h-10 rounded-md border border-line bg-card px-3 text-sm font-medium"
            >
              Marcar estes ({visible.length})
            </button>
            <button
              type="button"
              onClick={clearSelected}
              className="h-10 rounded-md px-3 text-sm font-medium text-muted"
            >
              Limpar marcação
            </button>
            <button
              type="button"
              onClick={resetPresets}
              className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-muted"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Restaurar lista
            </button>
            <p className="ml-auto text-sm text-muted tabular-nums">
              {visibleSelected} visíveis marcados
            </p>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {visible.length === 0 ? (
              <li className="rounded-lg border border-dashed border-line bg-card px-4 py-8 text-center text-sm text-muted">
                Nenhum lançamento com esse filtro. Insira um novo ou troque o dia.
              </li>
            ) : (
              visible.map((entry, index) => {
                const showHead = date === "todas" && (index === 0 || visible[index - 1]!.date !== entry.date);
                return (
                <li key={entry.id}>
                  {showHead ? (
                    <h3 className="mt-2 mb-2 text-sm font-semibold">
                      {brDate(entry.date)} · {weekday(entry.date)}
                    </h3>
                  ) : null}
                  <EntryCard
                    entry={entry}
                    checked={selected.includes(entry.id)}
                    confirming={confirmId === entry.id}
                    onToggle={() => toggle(entry.id)}
                    onEdit={() => openEdit(entry)}
                    onAskDelete={() => setConfirmId(entry.id)}
                    onCancelDelete={() => setConfirmId(null)}
                    onDelete={() => {
                      remove(entry.id);
                      setConfirmId(null);
                    }}
                  />
                </li>
                );
              })
            )}
          </ul>
        </section>

        <TextPanel
          text={textValue}
          edited={overrideFor === generated && override != null && override !== generated}
          schedule={scheduleOnly}
          count={selectedEntries.length}
          peso={peso}
          includeSchedule={includeSchedule !== false}
          copyState={copyState}
          onToggleSchedule={setIncludeSchedule}
          onChange={(value) => {
            setOverride(value);
            setOverrideFor(generated);
          }}
          onReset={() => {
            setOverride(null);
            setOverrideFor("");
          }}
          onCopy={() => void copyText(textValue)}
          onCopySchedule={() => void copyText(scheduleOnly)}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card px-4 py-3 lg:hidden">
        <button
          type="button"
          disabled={!textValue}
          onClick={() => void copyText(textValue)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper disabled:opacity-40"
        >
          <Copy className="size-4" aria-hidden="true" />
          {copyState || `Copiar texto (${selectedEntries.length})`}
        </button>
      </div>

      <Dialog.Root open={draft != null} onOpenChange={(open) => !open && setDraft(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-dvh overflow-y-auto rounded-t-xl border border-line bg-paper p-4 sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-6">
            {draft ? (
              <EntryForm
                draft={draft}
                mode={formMode}
                pesoText={pesoText}
                error={formError}
                onPeso={setPesoText}
                onChange={(next) => {
                  setFormError("");
                  setDraft(next);
                }}
                onClose={() => setDraft(null)}
                onSave={saveDraft}
              />
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

function DateChip({
  active,
  label,
  hint,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  hint?: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "min-h-14 shrink-0 rounded-md bg-accent px-3 py-2 text-left text-paper"
          : "min-h-14 shrink-0 rounded-md border border-line bg-card px-3 py-2 text-left text-ink"
      }
    >
      <span className="block text-sm font-semibold leading-none">{label}</span>
      {hint || count != null ? (
        <span className={active ? "mt-1 block text-xs text-paper/80" : "mt-1 block text-xs text-muted"}>
          {hint ?? ""}
          {hint && count != null ? " · " : ""}
          {count != null ? count : ""}
        </span>
      ) : null}
    </button>
  );
}

function EntryCard({
  entry,
  checked,
  confirming,
  onToggle,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  entry: Entry;
  checked: boolean;
  confirming: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}) {
  const issue = entryIssues(entry);
  const title = entry.kind === "carga" ? heading(entry) : "Concreto meio-fio";
  return (
    <article
      className={
        checked
          ? "rounded-lg border border-accent bg-accent-soft"
          : "rounded-lg border border-line bg-card"
      }
    >
      <div className="flex items-start gap-1 p-1">
        <label className="flex min-w-0 flex-1 cursor-pointer gap-3 p-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            aria-label={`Marcar ${fleetLabel(entry.frota)}`}
            className="mt-1 size-5 shrink-0 accent-accent"
          />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-base font-medium tabular-nums">{fleetLabel(entry.frota)}</span>
              <span className="text-sm text-muted">{title}</span>
            </span>
            <span className="mt-1 block text-sm text-ink">
              {entry.kind === "carga" ? (
                <>
                  {entry.placa || "sem placa"} · NF {entry.nf || "—"} · {fmtKg(entry.peso)}
                </>
              ) : (
                <>
                  Estaca {entry.estacaDe}–{entry.estacaAte}
                  {entry.lado ? ` · lado ${entry.lado.toLocaleLowerCase("pt-BR")}` : ""}
                </>
              )}
            </span>
            <span className="mt-0.5 block truncate text-sm text-muted">
              {brDate(entry.date)}
              {entry.kind === "carga" ? ` · ${entry.local} · OC ${entry.oc}` : entry.obs ? ` · ${entry.obs}` : ""}
            </span>
          </span>
        </label>
        <button
          type="button"
          onClick={onEdit}
          className="mt-2 inline-flex size-11 items-center justify-center rounded-md text-ink"
          aria-label={`Editar ${fleetLabel(entry.frota)}`}
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {entry.kind === "carga" ? (
          <>
            <TimeCell label="Hora PF" value={entry.horaPf} />
            <TimeCell label="Chegou" value={entry.chegou} />
            <TimeCell label="Descarga" value={entry.descarga} />
          </>
        ) : (
          <>
            <TimeCell label="Chegada" value={entry.chegada} />
            <TimeCell label="Iniciou" value={entry.iniciou} />
            <TimeCell label="Terminou" value={entry.terminou} />
          </>
        )}
      </div>
      {issue ? <p className="px-4 pb-3 text-sm text-danger">{issue}. Vale conferir antes de copiar.</p> : null}
      {confirming ? (
        <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2">
          <p className="text-sm">Excluir este lançamento?</p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancelDelete} className="h-10 px-2 text-sm font-medium">
              Cancelar
            </button>
            <button type="button" onClick={onDelete} className="h-10 px-2 text-sm font-semibold text-danger">
              Excluir
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-line px-4 py-1">
          <button type="button" onClick={onAskDelete} className="h-10 text-sm text-muted">
            Excluir
          </button>
        </div>
      )}
    </article>
  );
}

function TimeCell({ label, value }: { label: string; value: string }) {
  const odd = value !== "" && !isStandardTime(value);
  return (
    <div className="rounded-sm bg-paper px-2 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className={odd ? "font-mono text-base font-medium text-danger tabular-nums" : "font-mono text-base font-medium tabular-nums"}>
        {value || "—"}
      </p>
    </div>
  );
}

function TextPanel({
  text,
  edited,
  schedule,
  count,
  peso,
  includeSchedule,
  copyState,
  onToggleSchedule,
  onChange,
  onReset,
  onCopy,
  onCopySchedule,
}: {
  text: string;
  edited: boolean;
  schedule: string;
  count: number;
  peso: number;
  includeSchedule: boolean;
  copyState: string;
  onToggleSchedule: (value: boolean) => void;
  onChange: (value: string) => void;
  onReset: () => void;
  onCopy: () => void;
  onCopySchedule: () => void;
}) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto">
      <div className="rounded-lg border border-line bg-card p-4">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-tight">Texto</h2>
        </div>
        <p className="mt-1 text-sm text-muted tabular-nums">
          {count === 0
            ? "Marque lançamentos para montar a mensagem."
            : `${count} ${count === 1 ? "lançamento" : "lançamentos"} · ${fmtKg(peso)}`}
        </p>
        <label className="mt-3 flex items-start gap-3">
          <input
            type="checkbox"
            checked={includeSchedule}
            onChange={(event) => onToggleSchedule(event.target.checked)}
            className="mt-1 size-5 accent-accent"
          />
          <span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="size-3.5" aria-hidden="true" />
              Quadro de horários no final
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              Chegou, descarga e hora PF já entram em cada caminhão. Isto repete o quadro do dia.
            </span>
          </span>
        </label>
        <textarea
          id="texto-bica"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          rows={8}
          aria-label="Texto para copiar"
          placeholder="O texto dos lançamentos marcados aparece aqui, com os horários."
          className="mt-3 w-full resize-y rounded-md border border-line bg-paper px-3 py-3 text-sm leading-relaxed text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {edited ? (
          <button type="button" onClick={onReset} className="mt-2 h-10 text-sm font-semibold text-accent">
            Voltar ao texto automático
          </button>
        ) : null}
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            disabled={!text}
            onClick={onCopy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-paper disabled:opacity-40"
          >
            {copyState === "Copiado" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copyState || "Copiar texto"}
          </button>
          <button
            type="button"
            disabled={!schedule}
            onClick={onCopySchedule}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-semibold disabled:opacity-40"
          >
            Copiar só horários
          </button>
        </div>
      </div>
    </aside>
  );
}

function EntryForm({
  draft,
  mode,
  pesoText,
  error,
  onPeso,
  onChange,
  onClose,
  onSave,
}: {
  draft: Entry;
  mode: "create" | "edit";
  pesoText: string;
  error: string;
  onPeso: (value: string) => void;
  onChange: (entry: Entry) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Dialog.Title className="text-xl font-semibold tracking-tight">
            {mode === "create" ? "Inserir lançamento" : "Editar lançamento"}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">
            Escolha um dado da lista ou digite outro. Os horários entram no texto.
          </Dialog.Description>
        </div>
        <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-md" aria-label="Fechar">
          <X className="size-4" aria-hidden="true" />
        </Dialog.Close>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <KindButton
          active={draft.kind === "carga"}
          label="Caminhão ou carreta"
          onClick={() => {
            if (draft.kind === "carga") return;
            const next = blankCarga(draft.date, "157.838");
            next.id = draft.id;
            next.preset = draft.preset;
            next.frota = draft.frota;
            onChange(next);
            onPeso("");
          }}
        />
        <KindButton
          active={draft.kind === "meio_fio"}
          label="Concreto meio-fio"
          onClick={() => {
            if (draft.kind === "meio_fio") return;
            const next = blankMeioFio(draft.date);
            next.id = draft.id;
            next.preset = draft.preset;
            next.frota = draft.frota;
            onChange(next);
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Data">
          <input
            type="date"
            required
            value={draft.date}
            onChange={(event) => onChange({ ...draft, date: event.target.value })}
            className={fieldClass}
          />
        </Field>
        <Field label="Frota">
          <input
            list="frotas-bica"
            required
            value={draft.frota}
            placeholder="241"
            onChange={(event) => {
              const raw = fleetNum(event.target.value);
              const hit = FLEET.find((item) => item.frota === raw);
              if (draft.kind === "carga") {
                onChange({
                  ...draft,
                  frota: event.target.value,
                  placa: hit?.placa || draft.placa,
                  veiculo: hit?.veiculo || draft.veiculo,
                });
              } else {
                onChange({ ...draft, frota: event.target.value });
              }
            }}
            className={fieldClass}
          />
          <datalist id="frotas-bica">
            {FLEET.map((item) => (
              <option key={item.frota} value={item.frota}>
                {item.placa ? `${fleetLabel(item.frota)} · ${item.placa}` : fleetLabel(item.frota)}
              </option>
            ))}
          </datalist>
        </Field>
      </div>

      {draft.kind === "carga" ? (
        <CargaFields draft={draft} pesoText={pesoText} onPeso={onPeso} onChange={onChange} />
      ) : (
        <MeioFields draft={draft} onChange={onChange} />
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="h-11 rounded-md px-3 text-sm font-medium">
          Cancelar
        </button>
        <button type="submit" className="h-11 rounded-md bg-accent px-4 text-sm font-semibold text-paper">
          Salvar no texto
        </button>
      </div>
    </form>
  );
}

function CargaFields({
  draft,
  pesoText,
  onPeso,
  onChange,
}: {
  draft: Carga;
  pesoText: string;
  onPeso: (value: string) => void;
  onChange: (entry: Entry) => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Veículo">
          <div className="grid grid-cols-2 gap-2">
            {VEICULOS.map((veiculo) => (
              <Choice
                key={veiculo}
                active={draft.veiculo === veiculo}
                label={veiculo}
                onClick={() => onChange({ ...draft, veiculo })}
              />
            ))}
          </div>
        </Field>
        <Field label="Material">
          <div className="grid grid-cols-2 gap-2">
            {MATERIAIS.map((material) => (
              <Choice
                key={material}
                active={draft.material === material}
                label={material}
                onClick={() => onChange({ ...draft, material: material as Material })}
              />
            ))}
          </div>
        </Field>
      </div>
      <Field label="Serviço">
        <div className="flex flex-wrap gap-2">
          {SERVICOS.map((servico) => (
            <Choice
              key={servico}
              active={draft.servico === servico}
              label={servico}
              onClick={() =>
                onChange({
                  ...draft,
                  servico,
                  local: localForServico(servico),
                })
              }
            />
          ))}
        </div>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Placa">
          <input
            list="placas-bica"
            value={draft.placa}
            placeholder="RQN6A88"
            onChange={(event) => {
              const placa = event.target.value.toUpperCase();
              const hit = FLEET.find((item) => item.placa === placa.replace(/\s/g, ""));
              onChange({
                ...draft,
                placa,
                frota: hit?.frota || draft.frota,
                veiculo: hit?.veiculo || draft.veiculo,
              });
            }}
            className={fieldClass}
          />
          <datalist id="placas-bica">
            {FLEET.filter((item) => item.placa).map((item) => (
              <option key={item.placa} value={item.placa}>
                {fleetLabel(item.frota)}
              </option>
            ))}
          </datalist>
        </Field>
        <Field label="Nota fiscal">
          <input
            inputMode="numeric"
            value={draft.nf}
            onChange={(event) => onChange({ ...draft, nf: event.target.value.replace(/\D/g, "") })}
            className={fieldClass}
          />
        </Field>
        <Field label="Peso (kg)">
          <input
            inputMode="numeric"
            value={pesoText}
            placeholder="29320"
            onChange={(event) => onPeso(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="OC">
          <input
            list="ocs-bica"
            value={draft.oc}
            onChange={(event) => onChange({ ...draft, oc: event.target.value })}
            className={fieldClass}
          />
          <datalist id="ocs-bica">
            {OCS.map((oc) => (
              <option key={oc} value={oc} />
            ))}
          </datalist>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Hora PF">
          <TimeInput value={draft.horaPf} onChange={(horaPf) => onChange({ ...draft, horaPf })} />
        </Field>
        <Field label="Chegou">
          <TimeInput value={draft.chegou} onChange={(chegou) => onChange({ ...draft, chegou })} />
        </Field>
        <Field label="Descarga">
          <TimeInput value={draft.descarga} onChange={(descarga) => onChange({ ...draft, descarga })} />
        </Field>
      </div>
      <Field label="Local">
        <input
          list="locais-bica"
          value={draft.local}
          onChange={(event) => onChange({ ...draft, local: event.target.value })}
          className={fieldClass}
        />
        <datalist id="locais-bica">
          {LOCAIS.map((local) => (
            <option key={local} value={local} />
          ))}
        </datalist>
      </Field>
      <p className="text-sm text-muted">Destino no texto: {shortServico(draft.servico)} · {draft.local || "sem local"}</p>
    </>
  );
}

function MeioFields({ draft, onChange }: { draft: MeioFio; onChange: (entry: Entry) => void }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Chegada">
          <TimeInput value={draft.chegada} onChange={(chegada) => onChange({ ...draft, chegada })} />
        </Field>
        <Field label="Iniciou">
          <TimeInput value={draft.iniciou} onChange={(iniciou) => onChange({ ...draft, iniciou })} />
        </Field>
        <Field label="Terminou">
          <TimeInput value={draft.terminou} onChange={(terminou) => onChange({ ...draft, terminou })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Estaca de">
          <input
            inputMode="numeric"
            value={draft.estacaDe}
            onChange={(event) => onChange({ ...draft, estacaDe: event.target.value.replace(/\D/g, "") })}
            className={fieldClass}
          />
        </Field>
        <Field label="Estaca até">
          <input
            inputMode="numeric"
            value={draft.estacaAte}
            onChange={(event) => onChange({ ...draft, estacaAte: event.target.value.replace(/\D/g, "") })}
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="Lado">
        <div className="grid grid-cols-2 gap-2">
          {LADOS.map((lado) => (
            <Choice
              key={lado}
              active={draft.lado === lado}
              label={lado === "DIREITO" ? "Direito" : "Esquerdo"}
              onClick={() => onChange({ ...draft, lado: lado as Lado })}
            />
          ))}
        </div>
      </Field>
      <Field label="Observação">
        <textarea
          value={draft.obs}
          rows={3}
          onChange={(event) => onChange({ ...draft, obs: event.target.value })}
          className="w-full rounded-sm border border-line bg-card px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </Field>
    </>
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  if (value && !isStandardTime(value)) {
    return (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
        aria-invalid="true"
      />
    );
  }
  return <input type="time" value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} />;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Choice({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "h-11 rounded-sm bg-ink px-3 text-sm font-medium text-paper"
          : "h-11 rounded-sm border border-line bg-card px-3 text-sm font-medium"
      }
    >
      {label}
    </button>
  );
}

function KindButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "h-11 rounded-sm bg-accent px-2 text-sm font-semibold text-paper"
          : "h-11 rounded-sm border border-line bg-card px-2 text-sm font-medium"
      }
    >
      {label}
    </button>
  );
}

const fieldClass =
  "h-11 w-full rounded-sm border border-line bg-card px-3 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
