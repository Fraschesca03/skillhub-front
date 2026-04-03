import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModalAuth from './ModalAuth';
import './Navbar.css';

export default function Navbar() {
    const { utilisateur, logout, estConnecte } = useAuth();
    const navigate = useNavigate();

    const [modalOuverte, setModalOuverte] = useState(false);
    const [menuOuvert,   setMenuOuvert]   = useState(false);

    const handleLogout = async () => {
        await logout();
        setMenuOuvert(false);
        navigate('/');
    };

    const fermerMenu = () => setMenuOuvert(false);

    // Redirige vers le dashboard selon le role
    const allerAuDashboard = () => {
        fermerMenu();
        if (utilisateur?.role === 'formateur') {
            navigate('/dashboard/formateur');
        } else {
            navigate('/dashboard/apprenant');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">

                    <Link to="/" className="navbar-logo" onClick={fermerMenu}>
                        Skill<span className="navbar-logo-hub">Hub</span>
                    </Link>

                    <div className={`navbar-liens ${menuOuvert ? 'navbar-liens-ouvert' : ''}`}>
                        <Link to="/"           className="navbar-lien" onClick={fermerMenu}>Accueil</Link>
                        <Link to="/formations" className="navbar-lien" onClick={fermerMenu}>Formations</Link>
                        <a href="#apropos"     className="navbar-lien" onClick={fermerMenu}>A propos</a>
                        <a href="#contact"     className="navbar-lien" onClick={fermerMenu}>Contact</a>

                        <div className="navbar-separateur" />

                        {estConnecte() ? (
                            <>
                                {/* Clic sur le nom/avatar -> dashboard */}
                                <button className="navbar-profil" onClick={allerAuDashboard}>
                                    {utilisateur?.photo_profil ? (
                                        <img
                                            src={`http://localhost:8000${utilisateur.photo_profil}`}
                                            alt="profil"
                                            className="navbar-avatar"
                                        />
                                    ) : (
                                        <span className="navbar-avatar-initiales">
                                            {utilisateur?.nom?.slice(0, 2).toUpperCase()}
                                        </span>
                                    )}
                                    {utilisateur?.nom}
                                </button>

                                <button className="navbar-btn-deconnexion" onClick={handleLogout}>
                                    Se deconnecter
                                </button>
                            </>
                        ) : (
                            <button
                                className="navbar-btn-connexion"
                                onClick={() => { setModalOuverte(true); fermerMenu(); }}
                            >
                                Se connecter
                            </button>
                        )}
                    </div>

                    <button
                        className={`navbar-burger ${menuOuvert ? 'navbar-burger-ouvert' : ''}`}
                        onClick={() => setMenuOuvert(!menuOuvert)}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>
            </nav>

            {modalOuverte && (
                <ModalAuth
                    mode="login"
                    onFermer={() => setModalOuverte(false)}
                />
            )}
        </>
    );
}