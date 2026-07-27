"use client";

import { useActionState, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { FormState } from "@/lib/admin/form";
import type { BlockType } from "@/lib/admin/blocks";
import { RichTextInput } from "@/components/admin/RichTextInput";

// ---- tipe lokal (dengan uid untuk key & dnd) ----
interface UIBlock {
  uid: string;
  type: BlockType;
  content_en: string | null;
  content_id: string | null;
  caption_en: string | null;
  caption_id: string | null;
  media_id: string | null;
  embed_url: string | null;
}
interface UISection {
  uid: string;
  title_en: string;
  title_id: string;
  blocks: UIBlock[];
}

export interface PickerMedia {
  id: string;
  public_url: string;
  alt_en: string | null;
}

interface Props {
  projectId: string;
  initial: {
    title_en: string;
    title_id: string;
    blocks: Omit<UIBlock, "uid">[];
  }[];
  media: PickerMedia[];
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const RICH = new Set<BlockType>(["paragraph", "quote"]);
const inputClass =
  "w-full rounded-md border px-3 py-2 body-1 bg-[var(--background-color-white)] text-[var(--text-color-default)] border-[var(--divider-color)] outline-none focus:border-[var(--primary-base)]";

const BLOCK_LABEL: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraf",
  image: "Gambar",
  quote: "Kutipan",
  video: "Video",
  embed: "Embed",
};

// ============ Serialize untuk payload ============
function serialize(sections: UISection[]) {
  return sections.map((s) => ({
    title_en: s.title_en,
    title_id: s.title_id,
    blocks: s.blocks.map((b) => ({
      type: b.type,
      content_en: b.content_en,
      content_id: b.content_id,
      caption_en: b.caption_en,
      caption_id: b.caption_id,
      media_id: b.media_id,
      embed_url: b.embed_url,
    })),
  }));
}

// ============ Satu blok (sortable) ============
function BlockCard({
  block,
  media,
  onPatch,
  onRemove,
}: {
  block: UIBlock;
  media: PickerMedia[];
  onPatch: (patch: Partial<UIBlock>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.uid });
  const [pickerOpen, setPickerOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const chosen = media.find((m) => m.id === block.media_id) ?? null;

  return (
    <div ref={setNodeRef} style={style}
      className="flex flex-col gap-3 rounded-lg border p-3 border-[var(--divider-color)] bg-[var(--background-color-white)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <button type="button" {...attributes} {...listeners}
            className="cursor-grab rounded border px-1.5 label-3 border-[var(--divider-color)] text-[var(--text-color-tertiary)]"
            title="Seret untuk mengurutkan">⠿</button>
          <span className="label-3 text-[var(--text-color-tertiary)]">
            {BLOCK_LABEL[block.type]}
          </span>
        </span>
        <button type="button" onClick={onRemove}
          className="rounded border px-1.5 label-3 border-red-300 text-red-600 hover:bg-red-50">×</button>
      </div>

      {/* HEADING — plain, jadi anchor sidebar */}
      {block.type === "heading" && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input className={inputClass} placeholder="Judul heading (EN)"
            value={block.content_en ?? ""}
            onChange={(e) => onPatch({ content_en: e.target.value })} />
          <input className={inputClass} placeholder="Judul heading (ID)"
            value={block.content_id ?? ""}
            onChange={(e) => onPatch({ content_id: e.target.value })} />
        </div>
      )}

      {/* PARAGRAPH / QUOTE — rich text */}
      {RICH.has(block.type) && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="label-3 text-[var(--text-color-tertiary)]">Isi (EN)</span>
            <RichTextInput value={block.content_en ?? ""}
              onChange={(html) => onPatch({ content_en: html })} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="label-3 text-[var(--text-color-tertiary)]">Isi (ID)</span>
            <RichTextInput value={block.content_id ?? ""}
              onChange={(html) => onPatch({ content_id: html })} />
          </div>
          {block.type === "quote" && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <input className={inputClass} placeholder="Atribusi (EN)"
                value={block.caption_en ?? ""}
                onChange={(e) => onPatch({ caption_en: e.target.value })} />
              <input className={inputClass} placeholder="Atribusi (ID)"
                value={block.caption_id ?? ""}
                onChange={(e) => onPatch({ caption_id: e.target.value })} />
            </div>
          )}
        </div>
      )}

      {/* IMAGE — media picker */}
      {block.type === "image" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-20 w-28 overflow-hidden rounded-md border border-[var(--divider-color)] bg-[var(--background-color-default)]">
              {chosen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={chosen.public_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center label-3 text-[var(--text-color-tertiary)]">
                  Kosong
                </div>
              )}
            </div>
            <button type="button" onClick={() => setPickerOpen((o) => !o)}
              className="rounded-md border px-3 py-1.5 label-3 border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]">
              {pickerOpen ? "Tutup" : "Pilih gambar"}
            </button>
            {block.media_id && (
              <button type="button" onClick={() => onPatch({ media_id: null })}
                className="label-3 text-red-600 hover:underline">Hapus</button>
            )}
          </div>

          {pickerOpen && (
            <div className="grid grid-cols-4 gap-2 rounded-md border p-2 border-[var(--divider-color)] md:grid-cols-6">
              {media.length === 0 && (
                <p className="body-1 col-span-full p-2 text-[var(--text-color-tertiary)]">
                  Belum ada media. Upload di menu Media.
                </p>
              )}
              {media.map((m) => (
                <button key={m.id} type="button"
                  onClick={() => { onPatch({ media_id: m.id }); setPickerOpen(false); }}
                  className="aspect-square overflow-hidden rounded border-2"
                  style={{ borderColor: block.media_id === m.id ? "var(--primary-base)" : "transparent" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.public_url} alt={m.alt_en ?? ""} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className={inputClass} placeholder="Caption (EN)"
              value={block.caption_en ?? ""}
              onChange={(e) => onPatch({ caption_en: e.target.value })} />
            <input className={inputClass} placeholder="Caption (ID)"
              value={block.caption_id ?? ""}
              onChange={(e) => onPatch({ caption_id: e.target.value })} />
          </div>
        </div>
      )}

      {/* VIDEO / EMBED — URL */}
      {(block.type === "video" || block.type === "embed") && (
        <div className="flex flex-col gap-2">
          <input className={inputClass} placeholder="URL embed (mis. https://youtube.com/embed/…)"
            value={block.embed_url ?? ""}
            onChange={(e) => onPatch({ embed_url: e.target.value })} />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className={inputClass} placeholder="Caption (EN)"
              value={block.caption_en ?? ""}
              onChange={(e) => onPatch({ caption_en: e.target.value })} />
            <input className={inputClass} placeholder="Caption (ID)"
              value={block.caption_id ?? ""}
              onChange={(e) => onPatch({ caption_id: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Satu section ============
function SectionCard({
  section,
  media,
  onPatch,
  onRemove,
  onBlocksReorder,
}: {
  section: UISection;
  media: PickerMedia[];
  onPatch: (patch: Partial<UISection>) => void;
  onRemove: () => void;
  onBlocksReorder: (blocks: UIBlock[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const patchBlock = (uidB: string, patch: Partial<UIBlock>) =>
    onPatch({
      blocks: section.blocks.map((b) => (b.uid === uidB ? { ...b, ...patch } : b)),
    });

  const removeBlock = (uidB: string) =>
    onPatch({ blocks: section.blocks.filter((b) => b.uid !== uidB) });

  const addBlock = (type: BlockType) =>
    onPatch({
      blocks: [
        ...section.blocks,
        {
          uid: uid(), type,
          content_en: null, content_id: null,
          caption_en: null, caption_id: null,
          media_id: null, embed_url: null,
        },
      ],
    });

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = section.blocks.findIndex((b) => b.uid === active.id);
    const newI = section.blocks.findIndex((b) => b.uid === over.id);
    onBlocksReorder(arrayMove(section.blocks, oldI, newI));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border-2 p-4 border-[var(--divider-color)] bg-[var(--background-color-default)]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
          <input className={inputClass} placeholder="Judul section (EN) — mis. Design Process"
            value={section.title_en}
            onChange={(e) => onPatch({ title_en: e.target.value })} />
          <input className={inputClass} placeholder="Judul section (ID)"
            value={section.title_id}
            onChange={(e) => onPatch({ title_id: e.target.value })} />
        </div>
        <button type="button" onClick={onRemove}
          className="shrink-0 rounded-md border px-3 py-2 label-3 border-red-300 text-red-600 hover:bg-red-50">
          Hapus section
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={section.blocks.map((b) => b.uid)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {section.blocks.map((b) => (
              <BlockCard key={b.uid} block={b} media={media}
                onPatch={(patch) => patchBlock(b.uid, patch)}
                onRemove={() => removeBlock(b.uid)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(BLOCK_LABEL) as BlockType[]).map((t) => (
          <button key={t} type="button" onClick={() => addBlock(t)}
            className="rounded-md border px-2.5 py-1 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]">
            + {BLOCK_LABEL[t]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ Root ============
export function SectionEditor({ projectId, initial, media, action }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const [sections, setSections] = useState<UISection[]>(() =>
    initial.map((s) => ({
      uid: uid(),
      title_en: s.title_en,
      title_id: s.title_id,
      blocks: s.blocks.map((b) => ({ ...b, uid: uid() })),
    })),
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const patchSection = (uidS: string, patch: Partial<UISection>) =>
    setSections((ss) => ss.map((s) => (s.uid === uidS ? { ...s, ...patch } : s)));

  const removeSection = (uidS: string) =>
    setSections((ss) => ss.filter((s) => s.uid !== uidS));

  const addSection = () =>
    setSections((ss) => [...ss, { uid: uid(), title_en: "", title_id: "", blocks: [] }]);

  const onSectionDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = sections.findIndex((s) => s.uid === active.id);
    const newI = sections.findIndex((s) => s.uid === over.id);
    setSections((ss) => arrayMove(ss, oldI, newI));
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="payload" value={JSON.stringify(serialize(sections))} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSectionDragEnd}>
        <SortableContext items={sections.map((s) => s.uid)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6">
            {sections.map((s) => (
              <SortableSection key={s.uid} id={s.uid}>
                <SectionCard section={s} media={media}
                  onPatch={(patch) => patchSection(s.uid, patch)}
                  onRemove={() => removeSection(s.uid)}
                  onBlocksReorder={(blocks) => patchSection(s.uid, { blocks })} />
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button type="button" onClick={addSection}
        className="w-fit rounded-lg border px-4 py-2 label-3 border-[var(--divider-color)] text-[var(--text-color-secondary)] hover:bg-[var(--background-color-hover)]">
        + Tambah section
      </button>

      <div className="sticky bottom-4 flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="rounded-lg bg-[var(--primary-base)] px-5 py-2.5 label-3 text-white shadow-lg transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50">
          {pending ? "Menyimpan…" : "Simpan semua"}
        </button>
        {state.error && <span className="body-1 text-red-600">{state.error}</span>}
        {state.ok && <span className="body-1 text-[var(--primary-base)]">Tersimpan.</span>}
      </div>
    </form>
  );
}

// Wrapper agar section ikut sortable (drag lewat seluruh kartu header-nya).
function SortableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}>
      {children}
    </div>
  );
}

export default SectionEditor;