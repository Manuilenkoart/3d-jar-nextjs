import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { JarPage } from '@/ui/JarPage';

export const metadata: Metadata = {
  title: 'Танцюючий аватар',
  description:
    'Tanok – інструмент підтримки зборів, де після кожного внеску оживає танцюючий аватар. Підтримайте улюблених авторів та насолоджуйтеся веселим танцем!',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return redirect('/');

  return <JarPage clientId={id} />;
}
