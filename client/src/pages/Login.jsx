import React, { useContext, useState } from 'react';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { NavLink, useLocation } from 'react-router-dom'
import { login, registration } from '../http/userAPI';
import { Context } from '../index';

const Login = () => {
    const { user } = useContext(Context)
    const location = useLocation()
    const isLoginLocation = location.pathname === LOGIN_ROUTE
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const formClick = async () => {
        let data;
        if (isLoginLocation) {
            data = await login(email, password)
        } else {
            data = await registration(email, password)
        }
        user.setUser(user)
        user.setIsAuth(true)
    }

    return (
        <Container
            className='d-flex justify-content-center align-items-center'
            style={{ height: window.innerHeight - 56 }}>
            <Card style={{ width: 600 }} className='p-5'>
                <h2 className='m-auto mb-4'>{isLoginLocation ? 'Log in' : 'Sign up'}</h2>
                <Form className='d-flex flex-column'>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            className='bg-light mb-3'
                            placeholder='Enter email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    {!isLoginLocation && <Form.Group>
                        <Form.Label>Nickname*</Form.Label>
                        <Form.Control
                            className='bg-light mb-3'
                            placeholder='Enter login'
                        />
                    </Form.Group>
                    }
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className='bg-light mb-3'
                            placeholder='Enter password'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Row className='d-flex justify-content-between'>
                        {isLoginLocation ?
                            <div className='mb-2'>
                                Don't have an account yet? <NavLink to={REGISTRATION_ROUTE}>Sign up</NavLink>
                            </div>
                            :
                            <div className='mb-2'>
                                Already have an account? <NavLink to={LOGIN_ROUTE}>Log in</NavLink>
                            </div>
                        }
                        <Button
                            className='align-self-end'
                            variant='outline-success'
                            onClick={formClick}
                        >
                            {isLoginLocation ? 'Log in' : 'Sign up'}
                        </Button>
                    </Row>

                </Form>
            </Card>

        </Container>

    );
};

export default Login;