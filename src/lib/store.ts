import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const USE_CONVEX = process.env.USE_CONVEX === '1';

async function ensureFile(file: string) {
  try {
    await fs.access(file);
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify({ items: [] }, null, 2));
  }
}

export type JsonItem = Record<string, unknown> & { id?: string };

function hasItems(x: unknown): x is { items: unknown[] } {
  return typeof x === 'object' && x !== null && Array.isArray((x as { items?: unknown }).items);
}

export async function upsertItem(
  name: string,
  item: JsonItem
): Promise<Record<string, unknown> & { id: string; updatedAt: string }>{
  if (USE_CONVEX) {
    console.warn('[store] USE_CONVEX=1 set — falling back to file store (stub).');
    // TODO: wire Convex mutations here; keep API stable
  }
  const file = path.join(dataDir, `${name}.json`);
  await ensureFile(file);
  const now = new Date().toISOString();
  const raw = await fs.readFile(file, 'utf8');
  const parsed = raw ? (JSON.parse(raw) as unknown) : { items: [] };
  const items: JsonItem[] = hasItems(parsed) ? (parsed.items as JsonItem[]) : [];
  const id = item.id ?? randomUUID();
  const idx = items.findIndex((x) => x && typeof x === 'object' && (x as { id?: unknown }).id === id);
  const prev: JsonItem = (idx >= 0 ? items[idx] : {}) as JsonItem;
  const record = { ...prev, ...item, id, updatedAt: now } as Record<string, unknown> & {
    id: string;
    updatedAt: string;
  };
  if (idx >= 0) items[idx] = record as JsonItem; else items.push(record as JsonItem);
  await fs.writeFile(file, JSON.stringify({ items }, null, 2));
  return record;
}

export async function listItems<T = unknown>(name: string): Promise<T[]> {
  if (USE_CONVEX) {
    console.warn('[store] USE_CONVEX=1 set — falling back to file store (stub).');
    // TODO: wire Convex queries here; keep API stable
  }
  const file = path.join(dataDir, `${name}.json`);
  await ensureFile(file);
  const raw = await fs.readFile(file, 'utf8');
  const parsed = raw ? (JSON.parse(raw) as unknown) : { items: [] };
  const items = hasItems(parsed) ? (parsed.items as T[]) : [];
  return items;
}
