import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { COOKIE_KEYS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Збір',
  description: 'Після кожного донату оживає аватар. Підтримайте збір та насолоджуйтеся веселим танцем!',
};

export default async function Page() {
  const cookieStore = await cookies();
  const { value } = cookieStore.get(COOKIE_KEYS.jarId) ?? {};

  return value ? redirect('/jars/' + value) : redirect('/');
}
