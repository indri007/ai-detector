import { DraftDocument, DraftMetadata, LanguageCode } from "@/lib/types";

const DRAFTS_INDEX_KEY = "awp_drafts_index_v1";
const DRAFT_PREFIX = "awp_draft_doc_v1_";
const ACTIVE_DRAFT_KEY = "awp_active_draft_id_v1";

export class StorageQuotaError extends Error {
  constructor(message = "Penyimpanan browser penuh. Hapus beberapa draf lama.") {
    super(message);
    this.name = "StorageQuotaError";
  }
}

export class StorageUnavailableError extends Error {
  constructor(message = "LocalStorage browser tidak dapat diakses.") {
    super(message);
    this.name = "StorageUnavailableError";
  }
}

function isStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__awp_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function listDrafts(): DraftMetadata[] {
  if (!isStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(DRAFTS_INDEX_KEY);
    if (!raw) return [];
    const index: DraftMetadata[] = JSON.parse(raw);
    return Array.isArray(index)
      ? index.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      : [];
  } catch {
    return [];
  }
}

export function getActiveDraftId(): string | null {
  if (!isStorageAvailable()) return null;
  return window.localStorage.getItem(ACTIVE_DRAFT_KEY);
}

export function setActiveDraftId(id: string | null): void {
  if (!isStorageAvailable()) return;
  if (id) {
    window.localStorage.setItem(ACTIVE_DRAFT_KEY, id);
  } else {
    window.localStorage.removeItem(ACTIVE_DRAFT_KEY);
  }
}

export function getDraft(id: string): DraftDocument | null {
  if (!isStorageAvailable() || !id) return null;

  try {
    const raw = window.localStorage.getItem(`${DRAFT_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDraft(draft: DraftDocument): void {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  try {
    const payload = JSON.stringify(draft);
    window.localStorage.setItem(`${DRAFT_PREFIX}${draft.id}`, payload);

    // Update index
    const index = listDrafts().filter((d) => d.id !== draft.id);
    const meta: DraftMetadata = {
      id: draft.id,
      title: draft.title || "Draf Tanpa Judul",
      createdAt: draft.createdAt,
      updatedAt: new Date().toISOString(),
      wordCount: draft.wordCount,
    };
    index.unshift(meta);
    window.localStorage.setItem(DRAFTS_INDEX_KEY, JSON.stringify(index));
    setActiveDraftId(draft.id);
  } catch (err: unknown) {
    if (
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      throw new StorageQuotaError();
    }
    throw err;
  }
}

export function deleteDraft(id: string): void {
  if (!isStorageAvailable() || !id) return;

  try {
    window.localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
    const index = listDrafts().filter((d) => d.id !== id);
    window.localStorage.setItem(DRAFTS_INDEX_KEY, JSON.stringify(index));

    if (getActiveDraftId() === id) {
      setActiveDraftId(index.length > 0 ? index[0].id : null);
    }
  } catch {
    // Non-fatal cleanup failure
  }
}

export function createNewDraft(
  title = "Draf Akademik Baru",
  initialContent = "",
  language: LanguageCode = "en-US"
): DraftDocument {
  const id = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const newDraft: DraftDocument = {
    id,
    title,
    content: initialContent,
    language,
    wordCount: initialContent ? initialContent.trim().split(/\s+/).length : 0,
    createdAt: now,
    updatedAt: now,
  };

  saveDraft(newDraft);
  return newDraft;
}
