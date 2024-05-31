import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {

  return (
    <AppRouter />
  )
}

export default App

if (document.getElementById('root')) {
  const Index = ReactDOM.createRoot(document.getElementById("root"));

  Index.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}