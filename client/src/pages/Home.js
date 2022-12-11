import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home () {
  const role = useSelector(state => state.app.role);

  return <>
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">Welcome to Movies App</h1>
        <p className="col-md-8 fs-4">Click the button bellow to start searching!</p>
        <Link className="btn btn-primary btn-lg" to={'/search'}>Start Search</Link>
      </div>
    </div>
    {
      (role === 'reviewer' || role === 'admin') && <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Reviewer Functions</h1>
          <Link className="btn btn-primary btn-lg" to={'/review'}>Review Comments</Link>
        </div>
      </div>
    }
    {
      role === 'admin' && <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Admin Functions</h1>
          <Link className="btn btn-primary btn-lg" to={'/management'}>Users Management</Link>
        </div>
      </div>
    }
  </>;
}