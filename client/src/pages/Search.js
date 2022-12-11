import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function Search () {
  const params = useParams();
  const n = useNavigate();
  const [q, setQ] = useState(params.q ?? '');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!params.q) {
      return;
    }
    setLoading(true);
    axios.get('/movie/search/' + encodeURIComponent(params.q))
      .then(res => {
        setMovies(res.data.results);
      })
      .finally(() => {
        setLoading(false);
        setSearched(true);
      });
  }, [params.q]);

  return <>
    <div className="p-3 mb-4 bg-light rounded-3">
      <form className="container-fluid py-2" onSubmit={e => {
        e.preventDefault();
        n('/search/' + encodeURIComponent(q));
      }}>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Type to Search..." value={q}
                 onInput={e => setQ(e.target.value)} required={true}/>
          <button className="btn btn-outline-secondary" type="submit"
                  disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
        </div>
      </form>
    </div>
    {
      searched && movies.length === 0 && <div className="alert alert-warning" role="alert">
        No results for this query. Please try something else!
      </div>
    }
    {
      searched && movies.length > 0 && <div className="table-responsive">
        <table className={'table table-hover'}>
          <thead>
          <tr>
            <th>Index</th>
            <th>Poster</th>
            <th>Movie Name</th>
            <th>Release Date</th>
          </tr>
          </thead>
          <tbody>
          {
            movies.map((m, i) => <tr key={m.id}>
              <td>{i + 1}</td>
              <td><img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={'poster'}/></td>
              <td><Link to={'/movie/' + m.id}>{m.title}</Link></td>
              <td>{m.release_date}</td>
            </tr>)
          }
          </tbody>
        </table>
      </div>
    }
  </>;
}