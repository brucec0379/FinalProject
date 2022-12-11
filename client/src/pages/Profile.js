import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Profile () {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const user = useSelector(state => state.app.user);
  const role = useSelector(state => state.app.role);
  const isMe = params.id === user?._id;

  const updateProfile = useCallback(() => {
    return axios.get('/user/' + encodeURIComponent(params.id))
      .then(res => {
        setProfile(res?.data ?? null);
      });
  }, [params.id]);

  useEffect(() => {
    setLoading(true);
    updateProfile()
      .finally(() => {
        setLoading(false);
      });
  }, [params.id, updateProfile]);

  return <>
    {
      loading ? <p>Loading...</p> : <>
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold mb-4">
              User: {profile.profile.nickname}
              <span className={'ms-4'}>
                 {
                   !isMe && user && role === 'user' ? <>
                     {
                       profile.followers.find(v => v.to._id === profile.profile._id && v.from._id === user._id) ?
                         <button type={'button'} className={'btn btn-secondary'} onClick={() => {
                           axios.put(`/user/${params.id}/unfollow`)
                             .then(updateProfile);
                         }}>Unfollow</button> :
                         <button type={'button'} className={'btn btn-primary'} onClick={() => {
                           axios.put(`/user/${params.id}/follow`)
                             .then(updateProfile);
                         }}>Follow</button>
                     }
                   </> : null
                 }
                </span>
            </h1>
            <div className="col-md-8 fs-4">
              {
                isMe && <p><b>Email</b> (hidden to others): {user.email}</p>
              }
              <p><b>Joined</b>: {new Date(profile.profile.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>


        <div className={'row mt-4'}>
          <div className={'col-md-6'}>
            <h3>Followers <span className="badge bg-info">{profile.followers.length}</span></h3>
            <ul>
              {
                profile.followers.map(v => <li key={v._id}><Link
                  to={`/profile/${v.from._id}`}>{v.from.nickname}</Link></li>)
              }
            </ul>
            {
              profile.followers.length === 0 && <div className={'alert alert-info'}>No followers yet</div>
            }
          </div>
          <div className={'col-md-6'}>
            <h3>Followings <span className="badge bg-info">{profile.following.length}</span></h3>
            <ul>
              {
                profile.following.map(v => <li key={v._id}><Link to={`/profile/${v.to._id}`}>{v.to.nickname}</Link>
                </li>)
              }
            </ul>
            {
              profile.following.length === 0 && <div className={'alert alert-info'}>No followings yet</div>
            }
          </div>
        </div>

        <h3 className={'mt-4'}>Bookmarks <span className="badge bg-warning">{profile.bookmarks.length}</span></h3>
        <ul>
          {
            profile.bookmarks.map(v => <li key={v._id}><Link to={`/movie/${v.movieId}`}>{v.movieName}</Link></li>)
          }
        </ul>
        {
          profile.bookmarks.length === 0 && <div className={'alert alert-info'}>No bookmarks yet</div>
        }
      </>
    }
  </>;
}