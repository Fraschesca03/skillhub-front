import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import inscriptionService from '../services/inscriptionService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bouton from '../components/Bouton';
import './DashboardApprenantPage.css';

export default function DashboardApprenantPage() {
    const { utilisateur } = useAuth();
    const navigate = useNavigate();

    const [inscriptions,  setInscriptions]  = useState([]);
    const [chargement,    setChargement]    = useState(true);
    const [messageOk,     setMessageOk]     = useState('');
    const [erreur,        setErreur]        = useState('');

    const chargerInscriptions = async () => {
        setChargement(true);
        try {
            const data = await inscriptionService.mesFormations();
            setInscriptions(data);
        } catch (error) {
            setErreur('Erreur lors du chargement des formations.');
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerInscriptions();
    }, []);

    const handleDesinscrire = async (formationId) => {
        const confirme = window.confirm('Êtes-vous sûr de vouloir vous désinscrire de cette formation ?');
        if (!confirme) return;

        try {
            await inscriptionService.seDesinscrire(formationId);
            setMessageOk('Désinscription réussie.');
            chargerInscriptions();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            setErreur('Erreur lors de la désinscription.');
        }
    };

    const getNiveauLabel = (niveau) => {
        const labels = {
            debutant:      'Débutant',
            intermediaire: 'Intermédiaire',
            avance:        'Avancé',
        };
        return labels[niveau] || niveau;
    };

    return (
        <div className="da-page">
            <Navbar />

            <div className="da-contenu">

                {/* En-tête dashboard */}
                <div className="da-entete">
                    <div>
                        <h1 className="da-titre">Tableau de bord apprenant</h1>
                        <p className="da-sous-titre">
                            Bonjour {utilisateur?.nom}, retrouvez vos formations ici.
                        </p>
                    </div>
                    <Bouton
                        variante="principal"
                        taille="moyen"
                        onClick={() => navigate('/formations')}
                    >
                        Découvrir des formations
                    </Bouton>
                </div>

                {/* Messages */}
                {messageOk && <p className="da-succes">{messageOk}</p>}
                {erreur    && <p className="da-erreur">{erreur}</p>}

                {/* Liste des formations inscrites */}
                {chargement ? (
                    <p className="da-chargement">Chargement...</p>
                ) : inscriptions.length === 0 ? (
                    <div className="da-vide">
                        <p>Vous n'êtes inscrit à aucune formation pour le moment.</p>
                        <Bouton
                            variante="principal"
                            onClick={() => navigate('/formations')}
                        >
                            Découvrir les formations
                        </Bouton>
                    </div>
                ) : (
                    <div className="da-grille">
                        {inscriptions.map((inscription) => (
                            <div key={inscription.id} className="da-card">

                                <div className="da-card-badges">
                                    <span className="da-badge-niveau">
                                        {getNiveauLabel(inscription.formation?.niveau)}
                                    </span>
                                </div>

                                <h3 className="da-card-titre">
                                    {inscription.formation?.titre}
                                </h3>

                                <p className="da-card-description">
                                    {inscription.formation?.description?.slice(0, 100)}
                                    {inscription.formation?.description?.length > 100 ? '...' : ''}
                                </p>

                                {/* Barre de progression */}
                                <div className="da-progression-bloc">
                                    <div className="da-progression-header">
                                        <span className="da-progression-label">Progression</span>
                                        <span className="da-progression-valeur">
                                            {inscription.progression}%
                                        </span>
                                    </div>
                                    <div className="da-progression-barre">
                                        <div
                                            className="da-progression-remplissage"
                                            style={{ width: `${inscription.progression}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="da-card-actions">
                                    <Bouton
                                        variante="principal"
                                        taille="petit"
                                        onClick={() => navigate(`/apprendre/${inscription.formation_id}`)}
                                    >
                                        Suivre
                                    </Bouton>
                                    <Bouton
                                        variante="danger"
                                        taille="petit"
                                        onClick={() => handleDesinscrire(inscription.formation_id)}
                                    >
                                        Ne plus suivre
                                    </Bouton>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}