import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { ConnectionProvider } from './context/connection';
import { UpdateProvider } from './context/update';
import { createGlobalStyle } from 'styled-components';
import * as serviceWorker from './serviceWorker';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    -webkit-app-region: drag;
  }
`;

ReactDOM.render(
  <ConnectionProvider>
    <UpdateProvider>
      <GlobalStyles />
      <App />
    </UpdateProvider>
  </ConnectionProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
