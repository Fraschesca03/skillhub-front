import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import formationService from '../services/formationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bouton from '../components/Bouton';
import ModalFormation from '../components/ModalFormation';
import ModalModules from '../components/ModalModules';
import './DashboardFormateurPage.css';

export default function DashboardFormateurPage() {
    const { utilisateur } = useAuth();
    const navigate = useNavigate();

    const [formations,          setFormations]          = useState([]);
    const [chargement,          setChargement]          = useState(true);
    const [modalFormationOuverte, setModalFormationOuverte] = useState(false);
    const [modalModulesOuverte,   setModalModulesOuverte]   = useState(false);
    const [formationModif,      setFormationModif]      = useState(null);
    const [formationModules,    setFormationModules]    = useState(null);
    const [messageOk,           setMessageOk]           = useState('');
    const [erreur,              setErreur]              = useState('');

    const chargerFormations = async () => {
        setChargement(true);
        try {
            const data = await formationService.getFormations();
            // Comparaison avec parseInt pour éviter les erreurs string/number
            const mesFormations = data.filter(
                (f) => parseInt(f.formateur_id) === parseInt(utilisateur?.id)
            );
            setFormations(mesFormations);
        } catch (error) {
            setErreur('Erreur lors du chargement des formations.');
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerFormations();
    }, []);

    const handleSupprimer = async (id) => {
        const confirme = window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?');
        if (!confirme) return;

        try {
            await formationService.supprimerFormation(id);
            setMessageOk('Formation supprimée avec succès.');
            chargerFormations();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            setErreur('Erreur lors de la suppression.');
        }
    };

    const handleOuvrirCreation = () => {
        setFormationModif(null);
        setModalFormationOuverte(true);
    };

    const handleOuvrirModification = (formation) => {
        setFormationModif(formation);
        setModalFormationOuverte(true);
    };

    const handleOuvrirModules = (formation) => {
        setFormationModules(formation);
        setModalModulesOuverte(true);
    };

    const handleFermerModalFormation = () => {
        setModalFormationOuverte(false);
        setFormationModif(null);
    };

    const handleFermerModalModules = () => {
        setModalModulesOuverte(false);
        setFormationModules(null);
    };

    const handleSauvegarderFormation = () => {
        setMessageOk(formationModif ? 'Formation modifiée avec succès.' : 'Formation créée avec succès.');
        handleFermerModalFormation();
        chargerFormations();
        setTimeout(() => setMessageOk(''), 3000);
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
        <div className="df-page">
            <Navbar />

            <div className="df-contenu">
                <div className="df-entete">
                    <div>
                        <h1 className="df-titre">Tableau de bord formateur</h1>
                        <p className="df-sous-titre">
                            Bonjour {utilisateur?.nom}, gérez vos formations ici.
                        </p>
                    </div>
                    <Bouton
                        variante="principal"
                        taille="moyen"
                        onClick={handleOuvrirCreation}
                    >
                        + Créer une formation
                    </Bouton>
                </div>

                {messageOk && <p className="df-succes">{messageOk}</p>}
                {erreur    && <p className="df-erreur">{erreur}</p>}

                {chargement ? (
                    <p className="df-chargement">Chargement...</p>
                ) : formations.length === 0 ? (
                    <div className="df-vide">
                        <p>Vous n'avez pas encore créé de formation.</p>
                        <Bouton variante="principal" onClick={handleOuvrirCreation}>
                            Créer ma première formation
                        </Bouton>
                    </div>
                ) : (
                    <div className="df-grille">
                        {formations.map((formation) => (
                            <div key={formation.id} className="df-card">

                                <div className="df-card-badges">
                                    <span className="df-badge-niveau">
                                        {getNiveauLabel(formation.niveau)}
                                    </span>
                                </div>

                                <h3 className="df-card-titre">{formation.titre}</h3>

                                <p className="df-card-description">
                                    {formation.description?.slice(0, 100)}
                                    {formation.description?.length > 100 ? '...' : ''}
                                </p>

                                <div className="df-card-stats">
                                    <span>{formation.nombre_de_vues} vue{formation.nombre_de_vues > 1 ? 's' : ''}</span>
                                    <span>{formation.inscriptions_count} apprenant{formation.inscriptions_count > 1 ? 's' : ''}</span>
                                </div>

                                <div className="df-card-actions">
                                    <Bouton
                                        variante="fantome"
                                        taille="petit"
                                        onClick={() => navigate(`/formation/${formation.id}`)}
                                    >
                                        Voir détail
                                    </Bouton>
                                    <Bouton
                                        variante="secondaire"
                                        taille="petit"
                                        onClick={() => handleOuvrirModification(formation)}
                                    >
                                        Modifier
                                    </Bouton>
                                    <Bouton
                                        variante="secondaire"
                                        taille="petit"
                                        onClick={() => handleOuvrirModules(formation)}
                                    >
                                        Modules
                                    </Bouton>
                                    <Bouton
                                        variante="danger"
                                        taille="petit"
                                        onClick={() => handleSupprimer(formation.id)}
                                    >
                                        Supprimer
                                    </Bouton>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {modalFormationOuverte && (
                <ModalFormation
                    formation={formationModif}
                    onFermer={handleFermerModalFormation}
                    onSauvegarder={handleSauvegarderFormation}
                />
            )}

            {modalModulesOuverte && (
                <ModalModules
                    formation={formationModules}
                    onFermer={handleFermerModalModules}
                />
            )}
        </div>
    );
}