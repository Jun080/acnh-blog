import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ArticleDetail = () => {
    const [article, setArticle] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setArticle(data);
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    if (!article) {
        return <div>Chargement</div>;
    }

    return (
        <div>
            <h1>{article.titre}</h1>
            <p>
                <strong>Auteur:</strong> {article.auteur}
            </p>
            <p>
                <strong>Catégorie:</strong> {article.categorie}
            </p>
            <p>
                <strong>Statut:</strong> {article.statut}
            </p>
            <p>
                <strong>Publié:</strong> {article.publie ? "Oui" : "Non"}
            </p>
            <p>
                <strong>Vues:</strong> {article.vues}
            </p>
            <p>
                <strong>Créé le:</strong> {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <p>
                <strong>Modifié le:</strong> {new Date(article.updatedAt).toLocaleDateString()}
            </p>
            {article.image && (
                <div>
                    <strong>Image:</strong>
                    <br />
                    <img src={`${process.env.REACT_APP_UPLOADS_URL}/${article.image}`} alt={article.titre} />
                </div>
            )}
            <div>
                <h2>Contenu</h2>
                <p>{article.contenu}</p>
            </div>
        </div>
    );
};

export default ArticleDetail;
