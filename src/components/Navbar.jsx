import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModalAuth from './ModalAuth';
import './Navbar.css';

export default function Navbar() {
    const { utilisateur, logout, estConnecte } = useAuth();
    const navigate = useNavigate();

    // Contrôle de la modal : null | 'login' | 'register'
    const [modalMode, setModalMode] = useState(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const allerAuDashboard = () => {
        if (utilisateur?.role === 'formateur') {
            navigate('/dashboard/formateur');
        } else {
            navigate('/dashboard/apprenant');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-gauche">
                    <Link to="/" className="navbar-logo">SkillHub</Link>
                    <Link to="/formations" className="navbar-lien">Formations</Link>
                </div>

                <div className="navbar-droite">
                    {estConnecte() ? (
                        <>
                            <button className="navbar-profil" onClick={allerAuDashboard}>
                                {utilisateur?.nom}
                            </button>
                            <button className="navbar-btn-deconnexion" onClick={handleLogout}>
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="navbar-btn-secondaire"
                                onClick={() => setModalMode('login')}
                            >
                                Se connecter
                            </button>
                            <button
                                className="navbar-btn-principal"
                                onClick={() => setModalMode('register')}
                            >
                                S'inscrire
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Modal auth — s'affiche uniquement si modalMode est défini */}
            {modalMode && (
                <ModalAuth
                    mode={modalMode}
                    onFermer={() => setModalMode(null)}
                />
            )}
        </>
    );
}