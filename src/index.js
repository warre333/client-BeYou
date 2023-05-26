import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
 
import './styles/posts.css';

import Homepage from './pages/Homepage'
import Explore from './pages/Explore';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Ads from './pages/Ads';
import AdsPaid from './pages/AdsPaid';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAs7SRXYX3iB2-p6d7NiN6os7I5U4WU6kI",
  authDomain: "speakr-25c5d.firebaseapp.com",
  projectId: "speakr-25c5d",
  storageBucket: "speakr-25c5d.appspot.com",
  messagingSenderId: "559472586477",
  appId: "1:559472586477:web:ff14ad254b92e689dee6e4",
  measurementId: "G-TXR10MM6FF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Feeds */}
      <Route path="/" element={<Homepage />} />
      <Route path="/explore" element={<Explore />} />

      {/* People */}
      <Route path="/friends" element={<Friends />} />
      <Route path="/search" element={<Search />} />
      <Route path="/u/:username" element={<Profile />} />

      {/* Messages */}
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:chatroom" element={<Chat />} />

      {/* Posts */}
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:post" element={<Post />} />

      {/* Advertisements */}
      <Route path="/ads" element={<Ads />} />
      <Route path="/ads/paid" element={<AdsPaid />} />

      {/* Others */}
      <Route path="/settings" element={<Settings />} />

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);