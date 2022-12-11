import React from 'react';
import './index.css';
import Layout from './components/Layout.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.css';
import { createRoot } from 'react-dom/client';
import Search from './pages/Search';
import Movie from './pages/Movie';
import Profile from './pages/Profile';
import ReviewComment from './pages/ReviewComment';
import UserManagement from './pages/UserManagement';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4000/api';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider store={store}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path={'/search'} element={<Search/>}/>
        <Route path={'/search/:q'} element={<Search/>}/>
        <Route path={'/movie/:id'} element={<Movie/>}/>
        <Route path={'/profile'} element={<Profile/>}/>
        <Route path={'/profile/:id'} element={<Profile/>}/>
        <Route path={'/register'} element={<Register/>}/>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/review'} element={<ReviewComment/>}/>
        <Route path={'/management'} element={<UserManagement/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
</Provider>);