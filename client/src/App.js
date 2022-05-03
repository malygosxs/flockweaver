import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Context } from './index';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import './styles/bootstrap.min.css';
import { check } from './http/userAPI';
import './styles/App.css'

const App = observer(() => {
    const {user} = useContext(Context)

    useEffect(() => {
        check().then(data => {
            user.setIsAuth(true)
           
        })
        .catch(e => console.log('Auth'))
    }, [])

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    )
})

export default App;
