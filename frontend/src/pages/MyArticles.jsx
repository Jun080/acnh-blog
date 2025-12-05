import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        const newStatus = currentStatus === "publié" ? "brouillon" : "publié";

        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ statut: newStatus }),
            });

            if (response.ok) {
                setArticles(articles.map((article) => (article._id === articleId ? { ...article, statut: newStatus } : article)));
            } else {
                const data = await response.json();
                setMessage(data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    return (
        <div>
            <header>
                <h1>Mes Articles</h1>
                <Link to="/articles/new">Créer un article</Link>
            </header>

            {message && <div>{message}</div>}

            <div>
                <h2>Filtrer par statut :</h2>
                <div>
                    <button onClick={() => setFilter("tous")}>Tous </button>
                    <button onClick={() => setFilter("publié")}>Publiés</button>
                    <button onClick={() => setFilter("brouillon")}>Brouillons</button>
                </div>
            </div>

            {filteredArticles.length === 0 ? (
                <div>
                    <p>Aucun article trouvé {filter !== "tous" ? `pour le filtre "${filter}"` : ""}.</p>
                    <Link to="/articles/new">Créer un article</Link>
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Statut</th>
                                <th>Catégorie</th>
                                <th>Date de création</th>
                                <th>Vues</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArticles.map((article) => (
                                <tr key={article._id}>
                                    <td>
                                        <div>
                                            <h3>{article.titre}</h3>
                                            <p>{article.contenu.substring(0, 100)}...</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span>{article.statut === "publié" ? "Publié" : "Brouillon"}</span>
                                    </td>
                                    <td>{article.categorie}</td>
                                    <td>{article.createdAt}</td>
                                    <td>
                                        <span>{article.vues || 0}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <button onClick={() => handleToggleStatus(article._id, article.statut)}>
                                                {article.statut === "publié" ? "Brouillon" : "Publier"}
                                            </button>
                                            <button onClick={() => handleDelete(article._id)}>Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyArticles;
