import React from 'react';
import { Page } from '../pages/Page';
import { Button } from './Button';
import { ConnectPage } from '../pages/ConnectPage';
import { UpdatePage } from '../pages/UpdatePage';
import { useConnection } from '../context/connection';

export function App() {
  const [isFirstRender, setIsFirstRender] = React.useState(true);
  const { state } = useConnection();
  const connected = state === 'CONNECTED';

  if (isFirstRender) {
    return (
      <Page message={'Last Checked: Today at 18.41. Hope it Works'}>
        <Button onClick={() => setIsFirstRender(false)}>Check for Updates...</Button>
      </Page>
    );
  }

  if (!connected) {
    return <ConnectPage />;
  }

  return <UpdatePage />;
}
