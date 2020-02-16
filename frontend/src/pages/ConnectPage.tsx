import React from 'react';
import { Page } from './Page';
import { Button } from '../components/Button';
import { useConnection, ConnectionState } from '../context/connection';

type MessageType = Partial<{ [Key in ConnectionState]: string }>;
const MESSAGES: MessageType = {
  INITIAL: 'Press RESET on programmer, then click connect',
  CONNECTING: 'Connecting...',
  FAILED: 'Unable to connect. Check cable connections and retry.',
};

export function ConnectPage() {
  const { state, connect } = useConnection();
  const isConnecting = state === 'CONNECTING';
  const isFailure = state === 'FAILED';

  return (
    <Page message={MESSAGES[state]}>
      {isConnecting ? (
        <Button>Loading...</Button>
      ) : (
        <Button onClick={connect}>{isFailure ? 'Retry' : 'Connect'}</Button>
      )}
    </Page>
  );
}
