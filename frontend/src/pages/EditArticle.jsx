import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIconStyle } from "../utils/iconStyles";

const EditArticle = () => {
    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [categorie, setCategorie] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [message, setMessage] = useState("");
    const [isDraft, setIsDraft] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file || null);
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`);
                const data = await response.json();

                if (response.ok && !data.error) {
                    setTitre(data.titre || "");
                    setContenu(data.contenu || "");
                    setCategorie(data.categorie || "");
                    setIsDraft(data.statut === "brouillon");
                    setExistingImage(data.image || "");
                } else {
                    setMessage("Impossible de charger l'article");
                }
            } catch (error) {
                setMessage("Erreur lors du chargement de l'article");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

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
        if (!categorie.trim()) {
            setMessage("La catégorie est obligatoire");
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

            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                setMessage("Article modifié avec succès !");
                navigate(`/articles/${id}`);
            } else {
                setMessage(data.message || "Erreur lors de la mise à jour de l'article");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    if (loading) {
        return (
            <p>Chargement...</p>
        );
    }

    return (
        <main className="pb-24 pt-36 bg-pattern-leaves">
            <div className="container">
                    <div className="w-full max-w-5xl mx-auto bg-acnhOrange-50 rounded-2xl p-10 border-2 border-acnhGreen-200 relative z-10 flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b-2 border-dashed border-acnhNeutre-200 pb-6">
                            <div>
                                <h1 className="text-acnhGreen-700">Modifier l'article</h1>
                                <p className="text-acnhBlue-600 mt-1">Partagez vos découvertes insulaires&nbsp;!</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-8 flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-acnhBlue-600">Titre de l'article</h2>
                                    <input
                                        className="w-full rounded-2xl border-2 border-acnhNeutre-200 p-5 text-acnhNeutre-900 placeholder:text-acnhNeutre-400"
                                        placeholder="Comment décorer son camping..."
                                        type="text"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        maxLength={200}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-acnhBlue-600">Contenu</h2>
                                    <div className="relative">
                                        <textarea
                                            className="w-full h-80 rounded-2xl border-2 border-acnhNeutre-200 p-5 text-acnhNeutre-900 placeholder:text-acnhNeutre-400"
                                            placeholder="Racontez votre histoire ici..."
                                            value={contenu}
                                            onChange={(e) => setContenu(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-4 flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-acnhBlue-600">Catégorie</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="category-actualites" className="cursor-pointer group relative block">
                                                <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${categorie === "Actualités du jeu" ? getIconStyle("Actualités du jeu") : "border-acnhGreen-300"}`}>
                                                    <img src="/img/icons/icon-actualites.svg" alt="Actualités" className="w-7 h-7 mb-1" />
                                                    <span className="font-bold text-acnhNeutre-900">Actu</span>
                                                </div>
                                            </label>
                                            <input id="category-actualites" className="sr-only" name="category" type="radio" value="Actualités du jeu" checked={categorie === "Actualités du jeu"} onChange={(e) => setCategorie(e.target.value)} />
                                        </div>

                                        <div>
                                            <label htmlFor="category-faune" className="cursor-pointer group relative block">
                                                <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${categorie === "Faune" ? getIconStyle("Faune") : "border-acnhBlue-300"}`}>
                                                    <img src="/img/icons/icon-faune.svg" alt="Faune" className="w-7 h-7 mb-1" />
                                                    <span className="font-bold text-acnhNeutre-900">Faune</span>
                                                </div>
                                            </label>
                                            <input id="category-faune" className="sr-only" name="category" type="radio" value="Faune" checked={categorie === "Faune"} onChange={(e) => setCategorie(e.target.value)} />
                                        </div>

                                        <div>
                                            <label htmlFor="category-decoration" className="cursor-pointer group relative block">
                                                <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${categorie === "Décoration" ? getIconStyle("Décoration") : "border-acnhOrange-200"}`}>
                                                    <img src="/img/icons/icon-decoration.svg" alt="Décoration" className="w-7 h-7 mb-1" />
                                                    <span className="font-bold text-acnhNeutre-900">Déco</span>
                                                </div>
                                            </label>
                                            <input id="category-decoration" className="sr-only" name="category" type="radio" value="Décoration" checked={categorie === "Décoration"} onChange={(e) => setCategorie(e.target.value)} />
                                        </div>

                                        <div>
                                            <label htmlFor="category-villageois" className="cursor-pointer group relative block">
                                                <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${categorie === "Villageois" ? getIconStyle("Villageois") : "border-acnhOrange-800"}`}>
                                                    <img src="/img/icons/icon-villageois.svg" alt="Villageois" className="w-7 h-7 mb-1" />
                                                    <span className="font-bold text-acnhNeutre-900">Villageois</span>
                                                </div>
                                            </label>
                                            <input id="category-villageois" className="sr-only" name="category" type="radio" value="Villageois" checked={categorie === "Villageois"} onChange={(e) => setCategorie(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-acnhBlue-600">Couverture</h2>
                                    <div className="relative w-full h-40 border-2 border-dashed border-acnhBlue-300 rounded-3xl bg-acnhBlue-50 flex flex-col items-center justify-center">
                                        <input className="absolute w-full h-full opacity-0 cursor-pointer z-10" type="file" accept="image/*" onChange={handleImageChange} />
                                        <span className="font-bold text-acnhBlue-600">
                                            {image ? (image.name || "Image sélectionnée") : (existingImage ? `Image actuelle : ${existingImage}` : "Ajouter une photo")}
                                        </span>
                                    </div>
                                </div>

                                <label htmlFor="draft-checkbox" className="bg-white rounded-2xl p-4 border-2 border-acnhNeutre-200 flex items-center justify-between cursor-pointer">
                                    <span className="font-bold text-acnhNeutre-900">
                                        Brouillon
                                    </span>
                                    <input
                                        id="draft-checkbox"
                                        type="checkbox"
                                        className="h-5 w-5 border-acnhNeutre-300"
                                        checked={isDraft}
                                        onChange={(e) => setIsDraft(e.target.checked)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-end gap-4 pt-4 mt-2 border-t-2 border-dashed border-acnhNeutre-200">
                            <button type="button" onClick={() => navigate(-1)} className="btn-ac btn-ac-orange">
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit(isDraft ? "brouillon" : "publié")}
                                className="btn-ac btn-ac-green"
                            >
                                Mettre à jour l'article
                            </button>
                        </div>

                        {message ? <div className="text-center text-acnhOrange-800 font-bold">{message}</div> : null}
                    </div>
                </div>
        </main>
    );
};

export default EditArticle;
