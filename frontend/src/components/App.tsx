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
      <Page message={'Last Checked: Today at 9.00'}>
        <Button onClick={() => setIsFirstRender(false)}>
          Check for Updates...
        </Button>
      </Page>
    );
  }

  if (!connected) {
    return <ConnectPage />;
  }

  return <UpdatePage />;
}

// const initialState = {
//   connected: false,
//   isLoading: false,
//   message: 'Press RESET on programmer, then click connect',
//   deviceInfo: undefined,
//   hasUpdate: undefined,
//   error: null,
// };

// const connectReducer = (state, action) => {
//   switch (action.type) {
//     case 'CONNECT':
//       return {
//         ...state,
//         message: 'Connecting...',
//         isLoading: true,
//       };
//     case 'CONNECT_SUCCESS':
//       return {
//         ...state,
//         isLoading: false,
//         connected: true,
//         error: false,
//       };
//     case 'CONNECT_FAILURE':
//       return {
//         ...state,
//         message: 'Unable to connect. Check cable connections and retry',
//         connected: false,
//         isLoading: false,
//         error: true,
//       };
//     case 'SEARCH_UPDATE':
//       return {
//         ...state,
//         message: 'Searching for update...',
//         isLoading: true,
//       };
//     case 'UPDATE_AVAILABLE':
//       return {
//         ...state,
//         message: `Version ${action.update} now available!`,
//         hasUpdate: true,
//         isLoading: false,
//       };
//     case 'UPDATE_NOT_AVAILABLE':
//       return {
//         ...state,
//         message: 'Congratulations! You have already the newest version!',
//         hasUpdate: false,
//         isLoading: false,
//       };
//     case 'INSTALL_UPDATE':
//       return {
//         ...state,
//         message: 'Updating...',
//         isLoading: true,
//       };
//     case 'UPDATE_SUCCESS':
//       return {
//         ...state,
//         message: 'Awesome! You’re device is up to date now!',
//         isLoading: false,
//         error: false,
//       };
//     case 'UPDATE_FAILURE':
//       return {
//         ...state,
//         message: 'Something went wrong during update.',
//         isLoading: false,
//         error: true,
//       };
//     default:
//       throw new Error(`Undefined action type '${action.type}'`);
//   }
// };

// const App = () => {
//   const [
//     { connected, isLoading, message, hasUpdate, error },
//     dispatch,
//   ] = useReducer(connectReducer, initialState);
//   const [connect, connectStatus] = useBackendRequest('connect', {
//     onSuccess() {
//       dispatch({ type: 'CONNECT_SUCCESS' });
//       dispatch({ type: 'SEARCH_UPDATE' });
//       ipcRenderer.send('search-update');
//     },
//     onFailure() {
//       dispatch({ type: 'CONNECT_FAILURE' });
//     },
//   });

//   useEffect(() => {
//     ipcRenderer.on('update-available', (_, update) => {
//       console.log(update);
//       dispatch({ type: 'UPDATE_AVAILABLE', update });
//     });

//     ipcRenderer.on('update-not-available', () => {
//       dispatch({ type: 'UPDATE_NOT_AVAILABLE' });
//     });
//   }, []);

//   useEffect(() => {
//     ipcRenderer.on('update:success', () => {
//       dispatch({ type: 'UPDATE_SUCCESS' });
//     });

//     ipcRenderer.on('update:failure', () => {
//       dispatch({ type: 'UPDATE_FAILURE' });
//     });
//   }, []);

//   const connect = () => {
//     dispatch({ type: 'CONNECT' });
//     ipcRenderer.send('connect');
//   };

//   const installUpdate = () => {
//     dispatch({ type: 'INSTALL_UPDATE' });
//     ipcRenderer.send('update');
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <Message>{message}</Message>
//         <Button>Loading...</Button>
//       </Layout>
//     );
//   }

//   if (!connected) {
//     return (
//       <Layout>
//         <Message>{message}</Message>
//         <Button onClick={connect}>{error ? 'Retry' : 'Connect'}</Button>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <Message>{message}</Message>
//       {hasUpdate && (
//         <Button onClick={installUpdate}>
//           {error ? 'Retry' : 'Update Now'}
//         </Button>
//       )}
//     </Layout>
//   );
// };
