import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import { adminRoutes, authRoutes, publicRoutes } from '../routes';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const AppRouter = observer(() => {
    const { user } = useContext(Context)
    
    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {user.isAdmin && adminRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {/* <Route
                path="*"
                element={<Navigate to="/deckview" replace />}
            /> */}
            <Route exact path="/" element={<Navigate to="/deckview" />}>
                
            </Route>
        </Routes>
    );
});

export default AppRouter;