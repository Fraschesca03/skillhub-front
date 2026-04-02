import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import formationService from '../services/formationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bouton from '../components/Bouton';
import './AccueilPage.css';

export default function AccueilPage() {
    const { estConnecte } = useAuth();
    const navigate = useNavigate();

    const [formations, setFormations]     = useState([]);
    const [chargement, setChargement]     = useState(true);

    // Chargement des 3 premières formations pour la mise en avant
    useEffect(() => {
        const charger = async () => {
            try {
                const data = await formationService.getFormations();
                setFormations(data.slice(0, 3));
            } catch (error) {
                console.error('Erreur chargement formations :', error);
            } finally {
                setChargement(false);
            }
        };
        charger();
    }, []);

    return (
        <div className="accueil-page">

            {/* Composant Navbar commun */}
            <Navbar />

            {/* Section héro */}
            <section className="accueil-hero">
                <h1 className="accueil-hero-titre">
                    Partagez et développez vos compétences
                </h1>
                <p className="accueil-hero-description">
                    SkillHub met en relation des formateurs passionnés et des apprenants
                    motivés autour de formations en ligne structurées et gratuites.
                </p>

                {!estConnecte() && (
                    <div className="accueil-hero-actions">
                        <Bouton
                            variante="principal"
                            taille="grand"
                            onClick={() => navigate('/register')}
                        >
                            Commencer gratuitement
                        </Bouton>
                        <Bouton
                            variante="fantome"
                            taille="grand"
                            onClick={() => navigate('/formations')}
                        >
                            Voir les formations
                        </Bouton>
                    </div>
                )}
            </section>

            {/* Section avantages */}
            <section className="accueil-avantages">
                <div className="accueil-avantage">
                    <div className="accueil-avantage-icone">🎓</div>
                    <h3>Pour les apprenants</h3>
                    <p>
                        Accédez à des formations gratuites, suivez votre progression
                        module par module et apprenez à votre rythme.
                    </p>
                </div>
                <div className="accueil-avantage">
                    <div className="accueil-avantage-icone">📚</div>
                    <h3>Pour les formateurs</h3>
                    <p>
                        Créez et gérez vos formations, organisez vos modules et
                        partagez votre expertise avec une communauté d'apprenants.
                    </p>
                </div>
                <div className="accueil-avantage">
                    <div className="accueil-avantage-icone">🆓</div>
                    <h3>100% gratuit</h3>
                    <p>
                        Toutes les formations disponibles sur SkillHub sont
                        entièrement gratuites pour tous les apprenants.
                    </p>
                </div>
            </section>

            {/* Section formations mises en avant */}
            <section className="accueil-formations">
                <h2 className="accueil-section-titre">Formations à la une</h2>

                {chargement ? (
                    <p className="accueil-chargement">Chargement...</p>
                ) : formations.length === 0 ? (
                    <p className="accueil-vide">Aucune formation disponible pour le moment.</p>
                ) : (
                    <div className="accueil-formations-grille">
                        {formations.map((formation) => (
                            <div key={formation.id} className="accueil-card">
                                <div className="accueil-card-niveau-badge">
                                    {formation.niveau}
                                </div>
                                <h3 className="accueil-card-titre">{formation.titre}</h3>
                                <p className="accueil-card-formateur">
                                    Par {formation.formateur?.nom}
                                </p>
                                <Bouton
                                    variante="principal"
                                    taille="petit"
                                    onClick={() => navigate(`/formation/${formation.id}`)}
                                >
                                    Voir le détail
                                </Bouton>
                            </div>
                        ))}
                    </div>
                )}

                <div className="accueil-voir-tout">
                    <Bouton
                        variante="secondaire"
                        taille="moyen"
                        onClick={() => navigate('/formations')}
                    >
                        Voir toutes les formations
                    </Bouton>
                </div>
            </section>

            {/* Composant Footer commun */}
            <Footer />

        </div>
    );
}