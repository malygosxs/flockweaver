import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const AppRouter = observer(() => {
    const {user} = useContext(Context)
    console.log(user.isAuth);

    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {/* <Route
                path="*"
                element={<Navigate to="/deckview" replace />}
            /> */}
        </Routes>
    );
});

export default AppRouter;