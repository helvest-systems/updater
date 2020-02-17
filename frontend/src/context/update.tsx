import React, { useState } from 'react';

export type UpdateState =
  | 'INITIAL'
  | 'SEARCH_UPDATE'
  | 'CACHE_EMPTY'
  | 'UPDATE_AVAILABLE'
  | 'UPDATE_UNAVAILABLE'
  | 'UPDATING'
  | 'COMPLETED'
  | 'FAILED';

type UpdateCtx = {
  state: UpdateState;
  updateVersion?: string;
  searchUpdate: () => void;
  installUpdate: () => void;
};

const UpdateContext = React.createContext<UpdateCtx | undefined>(undefined);

export const UpdateProvider: React.FC<{}> = ({ children }) => {
  const [state, setState] = useState<UpdateState>('INITIAL');
  const [updateVersion, setUpdateVersion] = useState<string | undefined>(undefined);

  const searchUpdate = React.useCallback(() => {
    setState('SEARCH_UPDATE');
    window.emitBackendEvent('update/check');
  }, []);

  function installUpdate() {
    setState('UPDATING');
    window.emitBackendEvent('update/install');
  }

  React.useEffect(() => {
    window.addBackendListener('update/cache-empty', () => setState('CACHE_EMPTY'));

    window.addBackendListener('update/available', ({ version }) => {
      setState('UPDATE_AVAILABLE');
      setUpdateVersion(version);
    });

    window.addBackendListener('update/unavailable', () => setState('UPDATE_UNAVAILABLE'));

    window.addBackendListener('update/installed', () => setState('COMPLETED'));

    window.addBackendListener('update/failed', () => setState('FAILED'));
  }, []);

  return (
    <UpdateContext.Provider value={{ state, updateVersion, searchUpdate, installUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};

export function useUpdate() {
  const context = React.useContext(UpdateContext);
  if (context == null) {
    throw new Error('useUpdate can only be used inside an UpdateProvider.');
  }

  return context;
}
