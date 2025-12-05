import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateArticle = () => {
    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [categorie, setCategorie] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file || null);
    };

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
        return true;
    };

    const handleSubmit = async (statut = "publié") => {
        setMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem("userToken");

            const formData = new FormData();
            formData.append("titre", titre);
            formData.append("contenu", contenu);
            formData.append("categorie", categorie);
            formData.append("statut", statut);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage("Article créé avec succès !");

                setTitre("");
                setContenu("");
                setCategorie("");
                setImage(null);

                navigate(`/articles/${data.article._id}`);
            } else {
                setMessage(data.message || "Erreur lors de la création de l'article");
            }
        } catch (error) {
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
                    <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
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

            {message ? <div>{message}</div> : null}
        </div>
    );
};

export default CreateArticle;
