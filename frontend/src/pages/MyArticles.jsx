import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getIconStyle } from "../utils/iconStyles";

const MyArticles = () => {
    const [articles, setArticles] = useState([]);
    const [filter, setFilter] = useState("tous");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchMyArticles();
    }, [navigate]);

    const fetchMyArticles = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/my-articles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setArticles(Array.isArray(data) ? data : data.articles || []);
            } else {
                setMessage(data.message || "Erreur lors du chargement des articles");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    const filteredArticles = articles.filter((article) => {
        if (filter === "tous") return true;
        return article.statut === filter;
    });

    const handleDelete = async (articleId) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setArticles(articles.filter((article) => article._id !== articleId));
            } else {
                const data = await response.json();
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    const handleToggleStatus = async (articleId, currentStatus) => {
        try {
            const token = localStorage.getItem("userToken");

            if (currentStatus === "brouillon") {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}/publier`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setArticles(articles.map((article) => (article._id === articleId ? { ...article, statut: "publié" } : article)));
                } else {
                    const data = await response.json();
                    setMessage(data.message || "Erreur lors de la publication");
                }
            } else {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}/brouillon`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setArticles(articles.map((article) => (article._id === articleId ? { ...article, statut: "brouillon" } : article)));
                } else {
                    const data = await response.json();
                    setMessage(data.message || "Erreur lors du passage en brouillon");
                }
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    return (
        <div className="min-h-screen bg-acnhBlue-50 pb-24 pt-36">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-acnhGreen-600 mb-2">Mes Articles</h1>
                        <p className="text-acnhNeutre-900">Gérez vos publications</p>
                    </div>
                    <Link to="/articles/new" className="btn-ac btn-ac-green">
                        Créer un article
                    </Link>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-acnhOrange-100 border-2 border-acnhOrange-300 rounded-2xl text-acnhOrange-900">
                        {message}
                    </div>
                )}

                <div className="mb-8 flex gap-3">
                    <button 
                        onClick={() => setFilter("tous")}
                        className={`btn-ac-icon ${filter === "tous" ? "bg-acnhGreen-200 border-acnhGreen-400 text-acnhGreen-900" : "bg-acnhNeutre-100 border-acnhNeutre-200 text-acnhNeutre-900"}`}
                    >
                        <span className="font-bold">Tous</span>
                    </button>
                    <button 
                        onClick={() => setFilter("publié")}
                        className={`btn-ac-icon ${filter === "publié" ? "bg-acnhGreen-200 border-acnhGreen-400 text-acnhGreen-900" : "bg-acnhNeutre-100 border-acnhNeutre-200 text-acnhNeutre-900"}`}
                    >
                        <span className="font-bold">Publiés</span>
                    </button>
                    <button 
                        onClick={() => setFilter("brouillon")}
                        className={`btn-ac-icon ${filter === "brouillon" ? "bg-acnhOrange-200 border-acnhOrange-400 text-acnhOrange-900" : "bg-acnhNeutre-100 border-acnhNeutre-200 text-acnhNeutre-900"}`}
                    >
                        <span className="font-bold">Brouillons</span>
                    </button>
                </div>

                {filteredArticles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-acnhNeutre-600 mb-4">
                            Aucun article trouvé {filter !== "tous" ? `pour le filtre "${filter}"` : ""}.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <article key={article._id} className={`flex flex-col h-full border-2 ${getIconStyle(article.categorie)} rounded-lg overflow-hidden`}>
                                <div className="relative h-48 bg-acnhNeutre-200">
                                    {article.image ? (
                                        <img src={`http://localhost:3000/uploads/${article.image}`} alt={article.titre} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-acnhNeutre-600">Pas d'image</div>
                                    )}
                                    
                                    {article.icon && (
                                        <div className={`absolute top-3 right-3 rounded-full p-2 border-2 ${getIconStyle(article.categorie)}`}>
                                            <img src={article.icon} alt={article.categorie} className="w-5 h-5" />
                                        </div>
                                    )}

                                    {article.statut === "brouillon" && (
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-acnhOrange-600 text-acnhOrange-50 rounded-xl font-bold text-sm">
                                            Brouillon
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1 justify-between gap-7">
                                    <div className="flex justify-between">
                                        <div className="flex justify-center items-center gap-2">
                                            <img src="/img/icons/icon-passport.png" alt="passport icon" className="w-7 h-7" />
                                            <p className="text-acnhNeutre-900 font-bold">{article.auteur}</p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <img src="/img/icons/icon-calendrier.png" alt="calendar icon" className="w-7 h-7" />
                                            <p className="text-acnhNeutre-900 font-bold">{new Date(article.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-acnhNeutre-900 mb-2 line-clamp-2">
                                            <Link to={`/articles/${article._id}`}>
                                                {article.titre}
                                            </Link>
                                        </h3>

                                        <p className="text-acnhNeutre-600 mb-3 line-clamp-2">
                                            {article.contenu}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Link to={`/articles/${article._id}/edit`} className="btn-ac btn-ac-green w-full justify-center">
                                            Modifier
                                        </Link>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(article._id, article.statut)}
                                                className={`btn-ac ${article.statut === "publié" ? "btn-ac-outline-orange" : "btn-ac-green"} flex-1 justify-center`}
                                            >
                                                {article.statut === "publié" ? "Dépublier" : "Publier"}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                                                        handleDelete(article._id);
                                                    }
                                                }}
                                                className="btn-ac btn-ac-red flex-1 justify-center"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyArticles;
