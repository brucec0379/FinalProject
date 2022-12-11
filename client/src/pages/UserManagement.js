import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UserManagement () {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(() => {
    return axios.get('/user')
      .then(res => {
        setUsers(res.data);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .finally(() => {
        setLoading(false);
      });
  }, [fetchUsers]);

  return <>
    {
      loading ? <p>Loading...</p> : <>
        <div className="table-responsive mt-4">
          <h1>User Management</h1>
          <hr/>
          <div className={'alert alert-info'}>
            Banned users are not able to login anymore.
          </div>
          {
            users.length > 0 ? <table className={'table table-hover'}>
              <thead>
              <tr>
                <th>Index</th>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {
                users.map((v, i) => <tr key={v._id}>
                  <td>{i + 1}</td>
                  <td>{v.nickname}</td>
                  <td>{v.email}</td>
                  <td>{new Date(v.createdAt).toLocaleString()}</td>
                  <td>
                    <Link to={`/profile/${v._id}`} className={'btn btn-info'}>View Profile</Link>
                    {
                      v.banned ? <button type={'button'} className={'ms-2 btn btn-success'} onClick={() => {
                        axios.put(`/user/` + v._id + '/unban')
                          .then(fetchUsers);
                      }}>Unban
                      </button> : <button type={'button'} className={'ms-2 btn btn-danger'} onClick={() => {
                        axios.put(`/user/` + v._id + '/ban')
                          .then(fetchUsers);
                      }}>Ban
                      </button>
                    }

                  </td>

                </tr>)
              }
              </tbody>
            </table> : <div className={'alert alert-info'}>No users yet.</div>
          }
        </div>

      </>
    }
  </>;
}