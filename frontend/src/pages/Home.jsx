import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getIconStyle } from "../utils/iconStyles";

function Home() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const limit = 9;

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setIsConnected(!!token);
    }, []);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const params = new URLSearchParams();
                params.append("page", page);
                params.append("limit", limit);
                params.append("sort", "-createdAt");
                params.append("statut", "publié");
                if (selectedCategory) params.append("categorie", selectedCategory);
                if (searchTerm) params.append("search", searchTerm);

                const response = await fetch(`${process.env.REACT_APP_API_URL}/articles?${params.toString()}`);
                const data = await response.json();

                const items = Array.isArray(data) ? data : data.items || [];
                setArticles(items);
                setPageCount(data.pageCount || 1);

                const uniqueCategories = [...new Set(items.map((article) => article.categorie))];
                setCategories(uniqueCategories);
            } catch (error) {
                setArticles([]);
                setPageCount(1);
            }
        };

        fetchArticles();
    }, [page, selectedCategory, searchTerm]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handleCategory = (value) => {
        setSelectedCategory(value);
        setPage(1);
    };

    

    return (
        <div>
            <header className="hero-header">
                <div className="hero-illustration-bg"></div>

                <div className="hero-content">
                    <div className="hero-left">
                        <h1 className="text-acnhGreen-600">Vivez la vie insulaire à 100%</h1>
                        <p className="text-acnhNeutre-900">
                            Découvrez tous nos articles sur le monde merveilleux d'Animal Crossing. Partagez vos expériences, vos astuces et vos
                            moments magiques dans le jeu.
                        </p>
                        <Link to={isConnected ? "/my-articles" : "/login"} className="btn-ac btn-ac-green">
                            {isConnected ? "Mes articles" : "Connexion"}
                        </Link>
                    </div>

                    <div className="hero-right">
                        <img src="/img/bg-header.png" alt="Illustration Animal Crossing" />
                    </div>
                </div>
            </header>

            <main>
                <section id="articles" className="bg-acnhBlue-100">
                    <div className="py-8 border-y-2 border-dashed border-acnhNeutre-200">
                        <div className="container">
                            <div className="mx-auto flex w-full gap-4 flex-row items-center justify-between">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleCategory("")}
                                        className="btn-ac-icon bg-acnhNeutre-100 border-acnhNeutre-200 text-acnhNeutre-900"
                                    >
                                        <span className="font-bold">Toutes</span>
                                    </button>

                                    {categories.includes("Villageois") && (
                                        <button
                                            type="button"
                                            onClick={() => handleCategory("Villageois")}
                                            className="btn-ac-icon bg-acnhOrange-600 border-acnhOrange-800 text-acnhOrange-50"
                                        >
                                            <img src="/img/icons/icon-villageois.svg" alt="Villageois" className="w-4 h-4" />
                                            <span className="font-bold">Villageois</span>
                                        </button>
                                    )}

                                    {categories.includes("Décoration") && (
                                        <button
                                            type="button"
                                            onClick={() => handleCategory("Décoration")}
                                            className="btn-ac-icon bg-acnhOrange-100 border-acnhOrange-200 text-acnhOrange-900"
                                        >
                                            <img src="/img/icons/icon-decoration.svg" alt="Décoration" className="w-4 h-4" />
                                            <span className="font-bold">Décoration</span>
                                        </button>
                                    )}

                                    {categories.includes("Faune") && (
                                        <button
                                            type="button"
                                            onClick={() => handleCategory("Faune")}
                                            className="btn-ac-icon bg-acnhBlue-50 border-acnhBlue-300 text-acnhBlue-600"
                                        >
                                            <img src="/img/icons/icon-faune.svg" alt="Faune" className="w-4 h-4" />
                                            <span className="font-bold">Faune</span>
                                        </button>
                                    )}

                                    {categories.includes("Actualités du jeu") && (
                                        <button
                                            type="button"
                                            onClick={() => handleCategory("Actualités du jeu")}
                                            className="btn-ac-icon bg-acnhGreen-200 border-acnhGreen-300 text-acnhGreen-800"
                                        >
                                            <img src="/img/icons/icon-actualites.svg" alt="Actualités du jeu" className="w-4 h-4" />
                                            <span className="font-bold">Actualités du jeu</span>
                                        </button>
                                    )}
                                </div>
                                <div className="relative w-72">
                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-acnhNeutre-600">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Rechercher un article..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="block w-full rounded-2xl border-2 border-acnhNeutre-200 bg-acnhNeutre-100 py-2.5 pl-10 pr-4 text-acnhNeutre-900 shadow-inner placeholder:text-acnhNeutre-600 focus:border-acnhOrange-600 focus:ring-2 focus:ring-acnhOrange-600/40 focus:outline-none transition-transform duration-150 focus:scale-[1.01]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h2 className="pt-10 text-acnhGreen-600">Dernières trouvailles</h2>
                        <p className="text-acnhNeutre-900">Quoi de neuf sur l'archipel&nbsp;?</p>

                        {articles.length === 0 ? (
                            <p className="py-8 text-acnhNeutre-600">Aucun article trouvé.</p>
                        ) : (
                            <div className="py-8">
                                <div className="grid grid-cols-3 gap-6">
                                    {articles.map((article) => (
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
                                            </div>

                                            <div className="p-6 flex flex-col flex-1 justify-between gap-7">
                                                <div className="flex justify-between">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <img src="/img/icons/icon-passport.png" alt="passport icon" className="w-7 h-7" />
                                                        <p className="text-acnhNeutre-900 font-bold">{article.auteur}</p>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-2">
                                                        <img src="/img/icons/icon-calendrier.png" alt="calendar icon" className="w-7 h-7" />
                                                        <p className="text-acnhNeutre-900 font-bold">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-acnhNeutre-900 mb-2 line-clamp-2">
                                                        <Link to={`/articles/${article._id}`}>
                                                            {article.titre}
                                                        </Link>
                                                    </h3>

                                                    <p className="text-acnhNeutre-600 mb-3 line-clamp-2">
                                                        {article.contenu}   
                                                    </p>
                                                </div>

                                                <Link to={`/articles/${article._id}`} className="btn-ac btn-ac-green w-full justify-center">
                                                    Lire la suite
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={page <= 1}
                                        className="btn-ac btn-ac-orange disabled:opacity-50"
                                    >
                                        Précédent
                                    </button>
                                    <span className="text-acnhNeutre-800 font-bold">
                                        Page {page} / {pageCount}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
                                        disabled={page >= pageCount}
                                        className="btn-ac btn-ac-green disabled:opacity-50"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
