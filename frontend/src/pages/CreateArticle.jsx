import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateArticle = () => {
    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [auteur, setAuteur] = useState("");
    const [categorie, setCategorie] = useState("");
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("userToken");
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [navigate]);

    const validateForm = () => {
        if (!titre.trim()) {
            setMessage("Le titre est obligatoire");
            return false;
        }
        if (titre.length > 200) {
            setMessage("Le titre ne peut pas dépasser 200 caractères");
            return false;
        }
        if (!contenu.trim()) {
            setMessage("Le contenu est obligatoire");
            return false;
        }
        if (!auteur.trim()) {
            setMessage("L'auteur est obligatoire");
            return false;
        }
        return true;
    };

    const handleSubmit = async (statut = "publié") => {
        setMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ titre, contenu, auteur, categorie, image, statut }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Article créé avec succès :", data);
                setMessage("Article créé avec succès !");

                setTitre("");
                setContenu("");
                setAuteur("");
                setCategorie("");
                setImage("");

                navigate(`/articles/${data.article.id}`);
            } else {
                setMessage(data.message || "Erreur lors de la création de l'article");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setMessage("Erreur de connexion au serveur");
        }
    };

    return (
        <div>
            <h1>Créer un nouvel article</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="titre">Titre*</label>
                    <input
                        type="text"
                        id="titre"
                        name="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        placeholder="Entrez le titre de l'article"
                        maxLength={200}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="auteur">Auteur*</label>
                    <input
                        type="text"
                        id="auteur"
                        name="auteur"
                        value={auteur}
                        onChange={(e) => setAuteur(e.target.value)}
                        placeholder="Nom de l'auteur"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="categorie">Catégorie</label>
                    <select id="categorie" name="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="Technologie">Technologie</option>
                        <option value="Santé">Santé</option>
                        <option value="Finance">Finance</option>
                        <option value="Éducation">Éducation</option>
                        <option value="Divertissement">Divertissement</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="image">Image (optionnel)</label>
                    <input type="url" id="image" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL de l'image" />
                </div>

                <div>
                    <label htmlFor="contenu">Contenu*</label>
                    <textarea
                        id="contenu"
                        name="contenu"
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        placeholder="Rédigez le contenu de votre article..."
                        required
                    />
                </div>

                <div>
                    <button type="button" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "Masquer" : "Prévisualiser"}
                    </button>

                    <button type="button" onClick={() => navigate("/")}>
                        Annuler
                    </button>

                    <button type="button" onClick={() => handleSubmit("brouillon")}>
                        Enregistrer en brouillon
                    </button>

                    <button type="button" onClick={() => handleSubmit("publié")}>
                        Publier
                    </button>
                </div>
            </form>

            {showPreview && (
                <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
                    <h2>Prévisualisation</h2>
                    <h3>{titre || "Titre de l'article"}</h3>
                    {image && <img src={image} alt="Prévisualisation" style={{ maxWidth: "100%", height: "auto" }} />}
                    <p>
                        <strong>Auteur:</strong> {auteur || "Nom de l'auteur"}
                    </p>
                    <p>
                        <strong>Catégorie:</strong> {categorie || "Non spécifiée"}
                    </p>
                    <div style={{ whiteSpace: "pre-wrap" }}>{contenu || "Contenu de l'article..."}</div>
                </div>
            )}

            {message ? <div>{message}</div> : null}
        </div>
    );
};

export default CreateArticle;
