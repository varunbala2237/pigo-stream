import React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import IndexPage from './components/IndexPage';
import PlayGround from './components/PlayGround'
import WatchHistoryPage from './components/WatchHistoryPage';
import MyListPage from './components/MyListPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthPage/>} />
            <Route path="/index" element={<IndexPage/>} />
            <Route path="/play" element={<PlayGround/>} />
            <Route path="/watch-history" element={<WatchHistoryPage/>} />
            <Route path="/my-list" element={<MyListPage/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;