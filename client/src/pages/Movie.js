import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Movie () {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [bookmark, setBookmark] = useState(null);
  const user = useSelector(state => state.app.user);
  const role = useSelector(state => state.app.role)

  const fetchComments = useCallback(() => {
    return axios.get('/movie/' + encodeURIComponent(params.id) + '/comments')
      .then(res => {
        setComments(res.data);
      });
  }, [params.id]);

  const fetchBookmark = useCallback(() => {
    if (!user || role !== 'user') {
      return;
    }
    return axios.get('/movie/' + encodeURIComponent(params.id) + '/bookmark')
      .then(res => {
        setBookmark(res.data);
      });
  }, [params.id, user, role]);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setLoading(true);
    Promise.all([
      axios.get('/movie/' + encodeURIComponent(params.id)),
      fetchComments(),
      fetchBookmark(),
    ])
      .then(res => {
        setMovie(res[0].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id, fetchComments, fetchBookmark]);

  return <>
    {
      loading ? <p>Loading...</p> : <>
        <div className={'row mb-4'}>
          <div className={'col-md-4'}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={'poster'}
                 className={'img-thumbnail img-fluid'}/>
          </div>
          <div className={'col-md-8'}>
            <h2>{movie.title}</h2>
            <div className={'text-muted'}>[{movie.release_date}]</div>
            <div className={'my-4'}>
              {
                movie.genres?.map(g => <span key={g.id} className="badge bg-warning mx-1">{g.name}</span>)
              }
            </div>
            <p>{movie.overview}</p>
            <p>Rating/Count: {movie.vote_average}/{movie.vote_count}</p>
            <p>Homepage: <a href={movie.homepage} target={'_blank'} rel={'noreferrer'}>{movie.homepage}</a></p>
            {
              user && role === 'user' ? (
                bookmark ?
                  <button type={'button'} className={'btn btn-secondary'} onClick={() => {
                    axios.delete(`/movie/${movie.id}/bookmark`).then(fetchBookmark);
                  }}>Remove from Bookmark</button> :
                  <button type={'button'} className={'btn btn-primary'} onClick={() => {
                    axios.post(`/movie/${movie.id}/bookmark`, {
                      user: user._id,
                      movieId: movie.id,
                      movieName: movie.title
                    }).then(fetchBookmark);
                  }}>Add to Bookmark</button>
              ) : null
            }
          </div>
        </div>
        {
          user && role === 'user' ? <form onSubmit={e => {
            e.preventDefault();
            axios.post(`/movie/${movie.id}/comment`, {
              user: user._id,
              text: comment,
              movieId: movie.id,
              movieName: movie.title
            })
              .then(() => {
                setComment('');
                fetchComments();
              });
          }
          }>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder={'Say something...'} value={comment}
                     onChange={e => setComment(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form> : <div className={'alert alert-info'}>
            <><Link to={'/login'}>Login</Link> as user role to post comments!</>
          </div>
        }

        <div className="table-responsive mt-4">
          <h4>Comments</h4>
          {
            comments.length > 0 ? <table className={'table table-hover'}>
              <thead>
              <tr>
                <th>Index</th>
                <th>Comment</th>
                <th>By</th>
                <th>At</th>
              </tr>
              </thead>
              <tbody>
              {
                comments.map((v, i) => <tr key={v._id}>
                  <td>{i + 1}</td>
                  <td>{v.text}</td>
                  <td><Link to={`/profile/${v.user._id}`}>{v.user.nickname}</Link></td>
                  <td>{new Date(v.createdAt).toLocaleString()}</td>
                </tr>)
              }
              </tbody>
            </table> : <div className={'alert alert-info'}>No comments for this movie yet.</div>
          }
        </div>

      </>
    }
  </>;
}