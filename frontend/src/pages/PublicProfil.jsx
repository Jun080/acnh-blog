import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getIconStyle } from "../utils/iconStyles";

const PublicProfil = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [user, setUser] = useState({ nom: "", email: "", createdAt: "" });
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		const fetchPublicProfile = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}/public`);
				const data = await res.json();

				if (!res.ok || !data.success) {
					setMessage(data.message || "Profil inaccessible");
					return;
				}

				setUser(data.user);
				setArticles(Array.isArray(data.articles) ? data.articles : []);
			} catch (error) {
				setMessage("Erreur de connexion au serveur");
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchPublicProfile();
	}, [id]);

	if (loading) return <p className="min-h-screen pt-36 text-center">Chargement...</p>;

	if (message) {
		return (
			<div className="min-h-screen pt-36 text-center">
				<p className="text-acnhOrange-800 font-bold mb-4">{message}</p>
				<button onClick={() => navigate(-1)} className="btn-ac btn-ac-orange">Retour</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-acnhBlue-50 pb-24 pt-36">
			<div className="container">
				<h1 className="text-acnhGreen-600 mb-2">Profil public</h1>
				<p className="text-acnhNeutre-800 mb-6">Découvrez les publications de {user.nom}</p>

				<div className="flex flex-col gap-6 mb-10">
					<div className="bg-white rounded-3xl border-4 border-acnhGreen-200 p-6">
						<p className="text-acnhNeutre-700">Nom</p>
						<p className="text-acnhNeutre-900 font-bold">{user.nom}</p>
						<p className="text-acnhNeutre-700 mt-4">Email</p>
						<p className="text-acnhNeutre-900 font-bold">{user.email}</p>
						<p className="text-acnhNeutre-700 mt-4">Inscription</p>
						<p className="text-acnhNeutre-900 font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
					</div>

					<div className="bg-white rounded-3xl border-4 border-acnhBlue-200 p-6">
						<h2 className="text-acnhBlue-600 mb-4">Articles publiés ({articles.length})</h2>
						{articles.length === 0 ? (
							<p className="text-acnhNeutre-600">Aucun article publié pour l'instant.</p>
						) : (
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
											<div className="flex justify-between items-center flex-wrap gap-3">
												<div className="flex justify-center items-center gap-2">
													<img src="/img/icons/icon-passport.png" alt="passport icon" className="w-7 h-7" />
													{article.auteurPublic && article.auteurId ? (
														<Link to={`/users/${article.auteurId}`} className="text-acnhNeutre-900 font-bold underline">
															{article.auteur}
														</Link>
													) : (
														<p className="text-acnhNeutre-900 font-bold">{article.auteur}</p>
													)}
												</div>
												<div className="flex justify-center items-center gap-2">
													<img src="/img/icons/icon-calendrier.png" alt="calendar icon" className="w-7 h-7" />
													<p className="text-acnhNeutre-900 font-bold">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</p>
												</div>
												<div className="flex justify-center items-center gap-2">
													<span role="img" aria-label="vues" className="text-lg">👁️</span>
													<p className="text-acnhNeutre-900 font-bold">{article.vues || 0} vues</p>
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

											<Link to={`/articles/${article._id}`} className="btn-ac btn-ac-green w-full justify-center">
												Lire la suite
											</Link>
										</div>
									</article>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicProfil;
