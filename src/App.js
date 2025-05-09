import React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AuthUI from './components/AuthPage/AuthUI';
import IndexUI from './components/IndexPage/IndexUI';
import PlayGroundUI from './components/PlayerPage/PlayGroundUI';
import WatchHistoryUI from './components/WatchHistoryPage/WatchHistoryUI';
import MyListUI from './components/MyListPage/MyListUI';
import PigoStore from './components/PigoStorePage/PigoStore';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthUI/>} />
            <Route path="/index" element={<IndexUI/>} />
            <Route path="/play" element={<PlayGroundUI/>} />
            <Route path="/watch-history" element={<WatchHistoryUI/>} />
            <Route path="/my-list" element={<MyListUI/>} />
            <Route path="/pigostore" element={<PigoStore />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;