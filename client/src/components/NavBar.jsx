import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'
import { NavLink, useNavigate } from 'react-router-dom';
import { DECKVIEW_ROUTE, LOGIN_ROUTE } from '../utils/consts';

const NavBar = observer(() => {
    const { user } = useContext(Context)

    const history = useNavigate()

    return (
        <Navbar bg="dark" expand="sm" className='navbar-dark'>
            <Container fluid>
                <Navbar.Brand href="/deckview" >Flockweaver</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <NavLink className='text-decoration-none text-white-50' to={DECKVIEW_ROUTE}>Deckview</NavLink>
                    </Nav>
                    <Nav>
                        {user.isAuth ?
                            <Button variant="outline-primary" >Log out</Button>
                            :
                            <Button
                                variant="outline-primary"
                                onClick={() => history(LOGIN_ROUTE)}
                            >
                                Login
                            </Button>

                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;