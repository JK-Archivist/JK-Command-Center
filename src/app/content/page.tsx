import { listItems, upsertItem } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import ContentBoard from '@/components/ContentBoard';

export default async function ContentPage() {
  const stages = ['idea','script','thumb','film','publish'] as const;

  async function addIdea(formData: FormData) {
    'use server';
    const idea = String(formData.get('idea') || '').trim();
    if (idea) await upsertItem('content', { idea, status: 'idea' });
    revalidatePath('/content');
  }
  async function moveItem(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    const status = String(formData.get('status') || 'idea');
    if (id) await upsertItem('content', { id, status });
    revalidatePath('/content');
  }

  import type { ContentItem } from '@/components/ContentBoard';
  const items = await listItems<ContentItem>('content');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Content Pipeline</h1>
      <ContentBoard stages={[...stages]} items={items} moveAction={moveItem} addAction={addIdea} />
    </div>
  );
}
