import Admin from "./pages/Admin"
import DeckView from "./pages/DeckView"
import DeckViewPreview from "./pages/DeckViewPreview"
import Login from "./pages/Login"
import { ADMIN_ROUTE, DECKVIEWPREVIEW_ROUTE, DECKVIEW_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
]

export const publicRoutes = [
    {
        path: DECKVIEW_ROUTE + '/:id',
        Component: DeckView
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Login
    },
    {
        path: DECKVIEWPREVIEW_ROUTE,
        Component: DeckViewPreview
    }
]