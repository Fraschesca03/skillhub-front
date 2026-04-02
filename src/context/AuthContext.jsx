import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [utilisateur, setUtilisateur] = useState(
        authService.getUtilisateur()
    );

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUtilisateur(data.user);
        return data;
    };

    const register = async (nom, email, password, role) => {
        const data = await authService.register(nom, email, password, role);
        setUtilisateur(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUtilisateur(null);
    };

    const valeur = {
        utilisateur,
        login,
        register,
        logout,
        estConnecte: () => utilisateur !== null,
        estFormateur: () => utilisateur?.role === 'formateur',
        estApprenant: () => utilisateur?.role === 'apprenant',
    };

    return (
        <AuthContext.Provider value={valeur}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}