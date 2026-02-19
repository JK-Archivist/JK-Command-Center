import { listItems, upsertItem } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export default async function TeamPage() {
  async function addAgent(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const role = String(formData.get('role') || '').trim();
    const resp = String(formData.get('responsibilities') || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (id) await upsertItem('agents', { id, name: name || id, role, responsibilities: resp });
    revalidatePath('/team');
  }
  async function addSubagent(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '').trim();
    const parentAgentId = String(formData.get('parentAgentId') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const role = String(formData.get('role') || '').trim();
    if (id && parentAgentId) await upsertItem('subagents', { id, parentAgentId, name: name || id, role });
    revalidatePath('/team');
  }

  type Agent = { id: string; name?: string; role?: string; responsibilities?: string[] };
  type Sub = { id: string; parentAgentId: string; name?: string; role?: string };
  const agents = await listItems<Agent>('agents');
  const subs = await listItems<Sub>('subagents');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Team</h1>
      <section className="space-y-3">
        <h2 className="font-medium">Agents</h2>
        <form action={addAgent} className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded border bg-white p-3">
          <input name="id" placeholder="id (e.g., main)" className="rounded border px-3 py-2" />
          <input name="name" placeholder="name" className="rounded border px-3 py-2" />
          <input name="role" placeholder="role" className="rounded border px-3 py-2" />
          <input name="responsibilities" placeholder="responsibilities (comma)" className="rounded border px-3 py-2" />
          <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Add/Update</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.map(a => (
            <div key={a.id} className="rounded border bg-white p-3">
              <div className="font-medium">{a.name || a.id}</div>
              <div className="text-sm text-slate-600">{a.role}</div>
              {a.responsibilities?.length ? <div className="text-xs text-slate-500 mt-1">{a.responsibilities.join(', ')}</div> : null}
            </div>
          ))}
          {agents.length===0 && <div className="text-slate-400">No agents yet</div>}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Subagents</h2>
        <form action={addSubagent} className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded border bg-white p-3">
          <input name="id" placeholder="id (e.g., writer-1)" className="rounded border px-3 py-2" />
          <input name="parentAgentId" placeholder="parentAgentId (e.g., main)" className="rounded border px-3 py-2" />
          <input name="name" placeholder="name" className="rounded border px-3 py-2" />
          <input name="role" placeholder="role" className="rounded border px-3 py-2" />
          <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Add/Update</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subs.map(s => (
            <div key={s.id} className="rounded border bg-white p-3">
              <div className="font-medium">{s.name || s.id}</div>
              <div className="text-sm text-slate-600">{s.role} • parent: {s.parentAgentId}</div>
            </div>
          ))}
          {subs.length===0 && <div className="text-slate-400">No subagents yet</div>}
        </div>
      </section>
    </div>
  );
}
