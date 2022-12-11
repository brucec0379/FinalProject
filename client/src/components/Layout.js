import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useStore } from 'react-redux';
import { actions } from '../store/slices/app';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router';

// main entry
export default function Layout () {
  const user = useSelector(state => state.app.user);
  const role = useSelector(state => state.app.role)
  const loadingUser = useSelector(state => state.app.loadingUser);
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/auth/current`)
      .then(res => {
        if (res.data) {
          store.dispatch(actions.setUser(res.data.user));
          store.dispatch(actions.setRole(res.data.role));
        }
      })
      .finally(() => {
        store.dispatch(actions.setLoadingUser(false));
      });
  }, [store]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Webdev Final Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to={'/'}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to={'/search'}>
                <Nav.Link>Search</Nav.Link>
              </LinkContainer>
            </Nav>
            <div className="d-flex">
              <Nav className="me-auto">
                {
                  user ?
                    <NavDropdown title={`Welcome ${user.nickname}`} id="basic-nav-dropdown">
                      {
                        role === 'user' && <>
                          <LinkContainer to={'/profile/' + user._id}>
                            <NavDropdown.Item>Profile</NavDropdown.Item>
                          </LinkContainer>
                          <NavDropdown.Divider/>
                        </>
                      }
                      <NavDropdown.Item onClick={() => {
                        axios.get('/auth/logout')
                          .then(() => {
                            store.dispatch(actions.setUser(null));
                            store.dispatch(actions.setRole(null));
                            navigate('/login');
                          });
                      }}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown> : <>
                      <LinkContainer to={'/login'}>
                        <Nav.Link>Login</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to={'/register'}>
                        <Nav.Link>Register</Nav.Link>
                      </LinkContainer>
                    </>
                }
              </Nav>

            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className={'container mt-4'}>
        {
          loadingUser ? <p>Loading...</p> : <Outlet/>
        }
      </main>
    </div>
  );
}
