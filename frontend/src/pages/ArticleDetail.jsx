import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getIconStyle } from "../utils/iconStyles";
import { Meta } from "../components/Meta";

const ArticleDetail = () => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentMessage, setCommentMessage] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`);
                const data = await response.json();

                const token = localStorage.getItem("userToken");

                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));

                        const authorCheck = payload.userId && data.auteurId
                            ? payload.userId === data.auteurId
                            : false;

                        setIsAuthor(authorCheck);
                    } catch (error) {
                        console.error("Erreur lors du décodage du token:", error);
                    }
                }

                if (response.ok) {
                    setArticle(data);
                }
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}/comments`);
                const data = await response.json();
                if (response.ok) {
                    setComments(data);
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        if (id) {
            fetchArticle();
            fetchComments();
        }
    }, [id]);

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
                    setArticle((prev) => (prev ? { ...prev, statut: "publié" } : prev));
                } else {
                    console.error("Erreur lors de la publication", await response.text());
                }
            } else {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${articleId}/brouillon`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setArticle((prev) => (prev ? { ...prev, statut: "brouillon" } : prev));
                } else {
                    console.error("Erreur lors du passage en brouillon", await response.text());
                }
            }
        } catch (error) {
            console.error("Erreur de connexion au serveur");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            try {
                const token = localStorage.getItem("userToken");
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    navigate("/my-articles");
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentMessage("");

        if (!newComment.trim() || newComment.length < 5) {
            setCommentMessage("Le commentaire doit contenir au moins 5 caractères");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                setCommentMessage("Vous devez être connecté pour commenter");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ contenu: newComment }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([data, ...comments]);
                setNewComment("");
            } else {
                const data = await response.json();
                setCommentMessage(data.error || "Erreur lors de l'ajout du commentaire");
            }
        } catch (error) {
            setCommentMessage("Erreur de connexion au serveur");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Supprimer ce commentaire ?")) return;

        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setComments(comments.filter((c) => c._id !== commentId));
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    if (loading) {
        return (
            <p>Chargement...</p>
        );
    }
    return (
        <>
            <Meta 
                title={`${article.titre}`}
                description={article.contenu?.substring(0, 155)}
                image={`http://localhost:3000/uploads/${article.image}`}
                url={`http://localhost:3001/articles/${article?._id}`}
            />
        <div className="min-h-screen bg-pattern-confetti pb-24 pt-36">
            <div className="container">
                <div className="mx-auto">
                    <article className="bg-white rounded-3xl border-4 border-acnhGreen-200 p-8">
                        
                        <div className="relative h-64">
                            {article.image ? (
                                <img src={`http://localhost:3000/uploads/${article.image}`} alt={article.titre} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-acnhNeutre-600">Pas d'image</div>
                            )}
                            <span className={`absolute top-3 right-3 btn-ac-icon ${getIconStyle(article.categorie)}`}>
                                {article.categorie === "Villageois" && <img src="/img/icons/icon-villageois.svg" alt="" className="w-5 h-5" />}
                                {article.categorie === "Décoration" && <img src="/img/icons/icon-decoration.svg" alt="" className="w-5 h-5" />}
                                {article.categorie === "Faune" && <img src="/img/icons/icon-faune.svg" alt="" className="w-5 h-5" />}
                                {article.categorie === "Actualités du jeu" && <img src="/img/icons/icon-actualites.svg" alt="" className="w-5 h-5" />}
                                {article.categorie}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 py-6 mb-8 border-b-2 border-dashed border-acnhNeutre-200">
                            <div className="flex items-center gap-2">
                                <img src="/img/icons/icon-passport.png" alt="" className="w-7 h-7" />
                                {article.auteurPublic && article.auteurId ? (
                                    <Link to={`/users/${article.auteurId}`} className="text-acnhNeutre-900 font-bold underline">{article.auteur}</Link>
                                ) : (
                                    <span className="text-acnhNeutre-900 font-bold">{article.auteur}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <img src="/img/icons/icon-calendrier.png" alt="" className="w-7 h-7" />
                                <span className="text-acnhNeutre-900">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span role="img" aria-label="vues" className="text-lg">👁️</span>
                                <span className="text-acnhNeutre-900 font-bold">{article.vues || 0} vues</span>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            {article.statut === "brouillon" && (
                                <span className="flex px-3 py-2 align-center justify-center font-bold uppercase bg-acnhOrange-200 text-acnhOrange-900 rounded-xl">
                                    Brouillon
                                </span>
                            )}
                        </div>

                        <h1 className="text-acnhGreen-700 mb-6 leading-tight">
                            {article.titre}
                        </h1>

                        <div className="prose prose-lg max-w-none">
                            <div className="text-acnhNeutre-900 leading-relaxed whitespace-pre-wrap text-lg">
                                {article.contenu}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-dashed border-acnhNeutre-200">
                            <div className="flex items-center justify-between">
                                <div className="text-acnhNeutre-600">
                                    Dernière modification : {new Date(article.updatedAt).toLocaleDateString()}
                                </div>

                                {isAuthor && (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleToggleStatus(article._id, article.statut)}
                                            className={`btn-ac ${article.statut === "publié" ? "btn-ac-orange" : "btn-ac-green"}`}
                                        >
                                            {article.statut === "publié" ? "Brouillon" : "Publier"}
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/articles/${id}/edit`)}
                                            className="btn-ac btn-ac-orange"
                                        >
                                            Modifier
                                        </button>
                                        <button 
                                            onClick={handleDelete}
                                            className="btn-ac btn-ac-red"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>

                    {article.statut === "publié" && (
                        <section className="mt-12 bg-white rounded-3xl border-4 border-acnhBlue-200 p-8">
                            <h2 className="text-acnhBlue-600 mb-6">Commentaires ({comments.length})</h2>

                            {localStorage.getItem("userToken") ? (
                                <form onSubmit={handleCommentSubmit} className="mb-8">
                                    <textarea
                                        className="w-full rounded-2xl border-2 border-acnhNeutre-200 p-4 text-acnhNeutre-900 min-h-24"
                                        placeholder="Ajouter un commentaire (min. 5 caractères)..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        minLength={5}
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        {commentMessage && (
                                            <p className="text-sm text-acnhOrange-800">{commentMessage}</p>
                                        )}
                                        <button type="submit" className="btn-ac btn-ac-green ml-auto">
                                            Publier
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-acnhNeutre-600 mb-8">Connectez-vous pour laisser un commentaire.</p>
                            )}

                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-acnhNeutre-600">Aucun commentaire pour le moment.</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment._id} className="bg-acnhBlue-50 rounded-2xl p-4 border-2 border-acnhBlue-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <img src="/img/icons/icon-passport.png" alt="" className="w-6 h-6" />
                                                    <span className="font-bold text-acnhNeutre-900">
                                                        {comment.auteur?.nom || "Utilisateur"}
                                                    </span>
                                                    <span className="text-sm text-acnhNeutre-600">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {localStorage.getItem("userToken") && comment.auteur?._id === JSON.parse(atob(localStorage.getItem("userToken").split('.')[1])).userId && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-acnhNeutre-900">{comment.contenu}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ArticleDetail;