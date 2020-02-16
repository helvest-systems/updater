import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useUpdate, UpdateState } from '../context/update';

type MessageType = Partial<{ [Key in UpdateState]: string }>;
const MESSAGES: MessageType = {
  SEARCH_UPDATE: 'Searching update...',
  UPDATE_UNAVAILABLE: 'Nice! You have already the newest version!',
  UPDATING: 'Updating...',
  COMPLETED: 'Awesome! You’re device is up to date now!',
  FAILED: 'Something went wrong during update.',
};

export function UpdatePage() {
  const { state, updateVersion, searchUpdate, installUpdate } = useUpdate();
  const [progress, setProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const isFailure = state === 'FAILED';
  const message =
    state === 'UPDATE_AVAILABLE'
      ? `Version ${updateVersion} is available for your device.`
      : MESSAGES[state];

  useEffect(() => searchUpdate(), [searchUpdate]);

  useEffect(() => {
    window.addBackendListener('update/installing', ({ progress: value }) => {
      console.log(`update/installing ${value}%`);
      setProgress(value);
    });

    window.addBackendListener('app/is-offline', () => setIsOffline(true));
  }, []);

  if (state === 'SEARCH_UPDATE') {
    return (
      <Page
        message={
          isOffline ? 'App is offline. Searching inside cache...' : message
        }
      >
        <Button>Loading...</Button>
      </Page>
    );
  }

  if (state === 'UPDATING') {
    return (
      <Page message={message}>
        <ProgressBar progress={progress} />
      </Page>
    );
  }

  const quit = state === 'UPDATE_UNAVAILABLE' || state === 'COMPLETED';

  return (
    <Page message={message}>
      {quit ? (
        <Button onClick={() => window.emitBackendEvent('app/quit')}>
          Quit
        </Button>
      ) : (
        <Button onClick={installUpdate}>
          {isFailure ? 'Retry' : 'Update Now'}
        </Button>
      )}
    </Page>
  );
}
