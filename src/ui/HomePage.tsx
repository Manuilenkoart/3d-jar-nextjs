import { FC } from 'react';

import { RedirectForm } from './components';

export const HomePage: FC = () => (
  <div style={{ display: 'grid', height: '100vh', placeItems: 'center' }}>
    <div>
      <h1>новий збір</h1>

      <RedirectForm />
    </div>
  </div>
);
