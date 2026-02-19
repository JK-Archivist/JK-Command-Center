import { listItems, upsertItem } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export default async function MemoryPage(props: { searchParams?: Promise<{ q?: string }>}) {
  const sp = await props.searchParams;
  const q = (sp?.q || '').toLowerCase();

  async function addMemory(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '').trim();
    const contentMarkdown = String(formData.get('contentMarkdown') || '').trim();
    const tags = String(formData.get('tags') || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (title && contentMarkdown) await upsertItem('memories', { title, contentMarkdown, tags });
    revalidatePath('/memory');
  }

  type MemoryItem = { id: string; title?: string; contentMarkdown?: string; tags?: string[] };
  const items = await listItems<MemoryItem>('memories');
  const filtered = q ? items.filter(m => (m.title||'').toLowerCase().includes(q) || (m.contentMarkdown||'').toLowerCase().includes(q)) : items;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Memory</h1>
      <form action="/memory" method="get" className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search memories..." className="w-full rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Search</button>
      </form>
      <form action={addMemory} className="space-y-2 rounded border bg-white p-3">
        <div className="font-medium">Add Memory</div>
        <input name="title" placeholder="Title" className="w-full rounded border px-3 py-2" />
        <textarea name="contentMarkdown" placeholder="Content (markdown)" rows={4} className="w-full rounded border px-3 py-2" />
        <input name="tags" placeholder="tags (comma-separated)" className="w-full rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Save</button>
      </form>
      <ul className="space-y-3">
        {filtered.map(m => (
          <li key={m.id} className="rounded border bg-white p-3">
            <div className="font-medium">{m.title || m.id}</div>
            {m.tags?.length ? <div className="text-xs text-slate-500">{m.tags.join(', ')}</div> : null}
            <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.contentMarkdown?.slice(0,800)}</pre>
          </li>
        ))}
        {filtered.length===0 && <div className="text-slate-400">No memories match.</div>}
      </ul>
    </div>
  );
}
