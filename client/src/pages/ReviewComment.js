import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewComment () {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(() => {
    return axios.get('/comment')
      .then(res => {
        setComments(res.data);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchComments()
      .finally(() => {
        setLoading(false);
      });
  }, [fetchComments]);

  return <>
    {
      loading ? <p>Loading...</p> : <>
        <div className="table-responsive mt-4">
          <h1>Review Comments on All Movies</h1>
          <hr/>
          {
            comments.length > 0 ? <table className={'table table-hover'}>
              <thead>
              <tr>
                <th>Index</th>
                <th>Comment</th>
                <th>Movie</th>
                <th>By</th>
                <th>At</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {
                comments.map((v, i) => <tr key={v._id}>
                  <td>{i + 1}</td>
                  <td>{v.text}</td>
                  <td><Link to={`/movie/${v.movieId}`}>{v.movieName}</Link></td>
                  <td><Link to={`/profile/${v.user._id}`}>{v.user.nickname}</Link></td>
                  <td>{new Date(v.createdAt).toLocaleString()}</td>
                  <td>
                    <button type={'button'} className={'btn btn-secondary'} onClick={() => {
                      axios.delete(`/comment/` + v._id)
                        .then(fetchComments);
                    }}>Delete
                    </button>
                  </td>

                </tr>)
              }
              </tbody>
            </table> : <div className={'alert alert-info'}>No comments yet.</div>
          }
        </div>

      </>
    }
  </>;
}