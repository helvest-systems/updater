import React from 'react';

export type ConnectionState =
  | 'INITIAL'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'FAILED'
  | 'DISCONNECTED';

type ConncetionCtx = {
  state: ConnectionState;
  connect: () => void;
};

const ConnectionContext = React.createContext<ConncetionCtx | undefined>(
  undefined,
);

export const ConnectionProvider: React.FC<{}> = ({ children }) => {
  const [state, setState] = React.useState<ConnectionState>('INITIAL');
  function connect() {
    setState('CONNECTING');
    window.emitBackendEvent('connection/start');
  }

  React.useEffect(() => {
    window.addBackendListener(
      'connection/connected',
      (deviceInfo: DeviceData) => {
        console.log(deviceInfo);
        setState('CONNECTED');
      },
    );
    window.addBackendListener('connection/failed', () => setState('FAILED'));
  }, []);

  return (
    <ConnectionContext.Provider value={{ state, connect }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const context = React.useContext(ConnectionContext);
  if (context == null) {
    throw new Error(
      'useConnection can only be used inside a ConnectionProvider.',
    );
  }

  return context;
}
