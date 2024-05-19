
import './App.css';
import React from 'react';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} exact />
        <Route path='/chats' element={<ChatPage />} exact />
      </Routes>

    </div>


  );
}

export default App;
