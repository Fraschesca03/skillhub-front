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
        navigate('/');
    };

    const allerAuDashboard = () => {
        setMenuOuvert(false);
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

                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        Skill<span className="navbar-logo-hub">Hub</span>
                    </Link>

                    {/* Liens desktop */}
                    <div className={`navbar-liens ${menuOuvert ? 'navbar-liens-ouvert' : ''}`}>
                        <Link to="/"           className="navbar-lien" onClick={() => setMenuOuvert(false)}>Accueil</Link>
                        <Link to="/formations" className="navbar-lien" onClick={() => setMenuOuvert(false)}>Formations</Link>
                        <a href="#apropos"     className="navbar-lien" onClick={() => setMenuOuvert(false)}>A propos</a>
                        <a href="#contact"     className="navbar-lien" onClick={() => setMenuOuvert(false)}>Contact</a>

                        {estConnecte() ? (
                            <>
                                {/* Nom cliquable vers le dashboard */}
                                <button className="navbar-profil" onClick={allerAuDashboard}>
                                    {utilisateur?.nom}
                                </button>
                                <button className="navbar-btn-deconnexion" onClick={handleLogout}>
                                    Se deconnecter
                                </button>
                            </>
                        ) : (
                            /* Un seul bouton — ouvre modal avec login + onglet register */
                            <button
                                className="navbar-btn-connexion"
                                onClick={() => { setModalOuverte(true); setMenuOuvert(false); }}
                            >
                                Se connecter
                            </button>
                        )}
                    </div>

                    {/* Burger mobile */}
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

            {/* Modal auth — login avec onglet S'inscrire accessible */}
            {modalOuverte && (
                <ModalAuth
                    mode="login"
                    onFermer={() => setModalOuverte(false)}
                />
            )}
        </>
    );
}