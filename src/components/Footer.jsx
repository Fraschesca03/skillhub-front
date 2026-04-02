import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const annee = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-contenu">

                <div className="footer-bloc">
                    <h3 className="footer-logo">SkillHub</h3>
                    <p className="footer-description">
                        La plateforme collaborative qui met en relation
                        formateurs et apprenants autour de formations gratuites.
                    </p>
                </div>

                <div className="footer-bloc">
                    <h4 className="footer-titre-bloc">Navigation</h4>
                    <ul className="footer-liens">
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/formations">Formations</Link></li>
                        <li><Link to="/register">S'inscrire</Link></li>
                        <li><Link to="/login">Se connecter</Link></li>
                    </ul>
                </div>

                <div className="footer-bloc">
                    <h4 className="footer-titre-bloc">Rôles</h4>
                    <ul className="footer-liens">
                        <li>Apprenant — suivre des formations</li>
                        <li>Formateur — créer des formations</li>
                    </ul>
                </div>

            </div>

            <div className="footer-bas">
                <p>© {annee} SkillHub — Toutes les formations sont gratuites.</p>
            </div>
        </footer>
    );
}