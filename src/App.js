// App.js
import React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AuthUI from './components/AuthPage/AuthUI';
import IndexUI from './components/IndexPage/IndexUI';
import PlayGroundUI from './components/PlayGroundPage/PlayGroundUI';
import WatchHistoryUI from './components/WatchHistoryPage/WatchHistoryUI';
import MyListUI from './components/MyListPage/MyListUI';
import PigoStoreUI from './components/PigoStorePage/PigoStoreUI';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthUI/>} />
            <Route path="/index" element={<IndexUI/>} />
            <Route path="/play" element={<PlayGroundUI/>} />
            <Route path="/watch-history" element={<WatchHistoryUI/>} />
            <Route path="/my-list" element={<MyListUI/>} />
            <Route path="/pigostore" element={<PigoStoreUI />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;