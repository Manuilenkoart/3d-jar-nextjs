import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { JarPage } from '@/ui/JarPage';

export const metadata: Metadata = {
  title: 'Танцюючий аватар',
  description: 'Після кожного донату оживає аватар. Підтримайте збір та насолоджуйтеся веселим танцем!',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return redirect('/');

  return <JarPage clientId={id} />;
}
