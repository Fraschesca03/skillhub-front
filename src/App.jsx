import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AccueilPage from './pages/AccueilPage';
import CataloguePage from './pages/CataloguePage';
import DetailFormationPage from './pages/DetailFormationPage';

function RoutePrivee({ children }) {
    const { estConnecte } = useAuth();
    return estConnecte() ? children : <Navigate to="/" />;
}

function RouteFormateur({ children }) {
    const { estFormateur } = useAuth();
    return estFormateur() ? children : <Navigate to="/" />;
}

function RouteApprenant({ children }) {
    const { estApprenant } = useAuth();
    return estApprenant() ? children : <Navigate to="/" />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/"                element={<AccueilPage />} />
            <Route path="/formations"      element={<CataloguePage />} />
            <Route path="/formation/:id"   element={<DetailFormationPage />} />

            <Route
                path="/dashboard/formateur"
                element={
                    <RoutePrivee>
                        <RouteFormateur>
                            <AccueilPage />
                        </RouteFormateur>
                    </RoutePrivee>
                }
            />
            <Route
                path="/dashboard/apprenant"
                element={
                    <RoutePrivee>
                        <RouteApprenant>
                            <AccueilPage />
                        </RouteApprenant>
                    </RoutePrivee>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}