import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <link href="/dist/output.css" rel="stylesheet" type="text/html"/>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Layout /> }>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
