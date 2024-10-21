import React from 'react';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
