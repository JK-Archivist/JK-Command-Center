import { listItems, upsertItem } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export default async function OfficePage() {
  async function setActivity(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const agentId = String(formData.get('agentId') || 'main');
    const status = String(formData.get('status') || 'idle');
    const taskRef = String(formData.get('taskRef') || '');
    await upsertItem('activity', { id: id || undefined, agentId, status, taskRef: taskRef || undefined });
    revalidatePath('/office');
  }

  type Activity = { id: string; agentId?: string; status?: 'idle'|'working'|'blocked'; taskRef?: string };
  const activity = await listItems<Activity>('activity');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Office</h1>
      <form action={setActivity} className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded border bg-white p-3">
        <input name="agentId" placeholder="agentId (default main)" className="rounded border px-3 py-2" />
        <input name="taskRef" placeholder="taskRef (optional)" className="rounded border px-3 py-2" />
        <select name="status" className="rounded border px-3 py-2">
          <option value="idle">idle</option>
          <option value="working">working</option>
          <option value="blocked">blocked</option>
        </select>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Update</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activity.map(a => (
          <div key={a.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${a.status==='working'?'bg-green-500':a.status==='blocked'?'bg-red-500':'bg-slate-300'}`} />
              <div className="font-medium">{a.agentId}</div>
            </div>
            <div className="text-sm text-slate-600 mt-1">{a.status}{a.taskRef?` • task ${a.taskRef.substring(0,8)}`:''}</div>
          </div>
        ))}
        {activity.length===0 && <div className="text-slate-400">No active work right now</div>}
      </div>
    </div>
  );
}
