import api from './axiosConfig';

const authService = {

    register: async (nom, email, password, role) => {
        const response = await api.post('/register', { nom, email, password, role });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Erreur logout :', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    profil: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    getUtilisateur: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    estConnecte: () => {
        return localStorage.getItem('token') !== null;
    },

    estFormateur: () => {
        const user = authService.getUtilisateur();
        return user && user.role === 'formateur';
    },

    estApprenant: () => {
        const user = authService.getUtilisateur();
        return user && user.role === 'apprenant';
    },
};

export default authService;