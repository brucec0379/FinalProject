import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { actions } from '../store/slices/app';
import { useStore } from 'react-redux';

export default function Register () {
  const [data, setData] = useState({ nickname: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();
  const store = useStore();

  function onInput (e) {
    console.log(e.target.value);
    setData(prevState => ({
      ...prevState,
      [e.target.getAttribute('name')]: e.target.value
    }));
  }

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();

        axios.post(`/auth/register`, data)
          .then(res => {
            store.dispatch(actions.setUser(res.data.user));
            store.dispatch(actions.setRole(res.data.role));
            navigate('/');
          })
          .catch(err => {
            alert(err.response?.data?.error ?? err.message);
          });
      }}>
        <h1>Register</h1>

        <div className="my-3">
          <label>Email</label>
          <input className={'form-control'} name="email" type={'email'} value={data.email} onInput={onInput} required/>
        </div>

        <div className="my-3">
          <label>Password</label>
          <input className={'form-control'} name="password" type={'password'} value={data.password} onInput={onInput}
                 required/>
        </div>
        <div className="my-3">
          <label>Nickname</label>
          <input className={'form-control'} type={'text'} name="nickname" value={data.nickname} onInput={onInput}
                 required/>
        </div>

        <div className={'my-3'}>
          <label>Role</label>
          <br/>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input className="form-check-input" type="radio" name="role" value="user" checked={data.role === 'user'}
                     onChange={() => setData({ ...data, role: 'user' })}/>
              User
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input className="form-check-input" type="radio" name="role" value="reviewer"
                     checked={data.role === 'reviewer'} onChange={() => setData({ ...data, role: 'reviewer' })}/>
              Reviewer
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input className="form-check-input" type="radio" name="role" value="admin"
                     checked={data.role === 'admin'} onChange={() => setData({ ...data, role: 'admin' })}/>
              Admin
            </label>
          </div>
        </div>


        <div className="my-3">
          <button className={'btn btn-primary'}>Register</button>
        </div>

      </form>
    </div>
  );
}