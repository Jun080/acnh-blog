import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [user, setUser] = useState({ nom: "", email: "", createdAt: "" });
	const [stats, setStats] = useState({ articles: 0, commentaires: 0 });

	const [nom, setNom] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("userToken");
		if (!token) {
			navigate("/login");
			return;
		}
		fetchProfile();
	}, [navigate]);

	const fetchProfile = async () => {
		try {
			const token = localStorage.getItem("userToken");
			const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				setMessage(data.message || "Erreur lors du chargement du profil");
				setLoading(false);
				return;
			}
			setUser(data.user);
			setStats(data.stats || { articles: 0, commentaires: 0 });
			setNom(data.user.nom || "");
			setEmail(data.user.email || "");
		} catch (error) {
			setMessage("Erreur de connexion au serveur");
		} finally {
			setLoading(false);
		}
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setMessage("");
		try {
			const token = localStorage.getItem("userToken");
			const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ nom, email }),
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				setMessage(data.message || "Erreur lors de la mise à jour");
				return;
			}
			setUser(data.user);
			setMessage("Profil mis à jour");
		} catch (error) {
			setMessage("Erreur de connexion au serveur");
		}
	};

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();
		setMessage("");
		try {
			const token = localStorage.getItem("userToken");
			const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me/password`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				setMessage(data.message || "Erreur lors du changement de mot de passe");
				return;
			}
			setMessage("Mot de passe mis à jour");
			setCurrentPassword("");
			setNewPassword("");
		} catch (error) {
			setMessage("Erreur de connexion au serveur");
		}
	};

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        navigate("/");
    };


    if (loading) {
        return (
            <p>Chargement...</p>
        );
    }

	return (
		<div className="min-h-screen bg-acnhBlue-50 pb-24 pt-36">
			<div className="container">
				<h1 className="text-acnhGreen-600 mb-4">Mon profil</h1>
				<p className="text-acnhNeutre-800 mb-8">Gérez vos informations personnelles et votre mot de passe.</p>

				{message && (
					<div className="mb-6 p-4 bg-acnhOrange-100 border-2 border-acnhOrange-300 rounded-2xl text-acnhOrange-900 font-bold">
						{message}
					</div>
				)}

				<div className="grid grid-cols-3 gap-6 mb-10">
					<div className="bg-white rounded-3xl border-4 border-acnhGreen-200 p-6">
						<p className="text-acnhNeutre-700">Nom</p>
						<p className="text-acnhNeutre-900 font-bold">{user.nom}</p>
						<p className="text-acnhNeutre-700 mt-4">Email</p>
						<p className="text-acnhNeutre-900 font-bold">{user.email}</p>
						<p className="text-acnhNeutre-700 mt-4">Inscription</p>
						<p className="text-acnhNeutre-900 font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
					</div>

					<div className="bg-white rounded-3xl border-4 border-acnhBlue-200 p-6">
						<p className="text-acnhNeutre-700">Articles</p>
						<p className="text-acnhNeutre-900 font-bold text-3xl">{stats.articles}</p>
						<p className="text-acnhNeutre-700 mt-4">Commentaires</p>
						<p className="text-acnhNeutre-900 font-bold text-3xl">{stats.commentaires}</p>
					</div>

                    <div className="flex flex-col gap-4 h-full justify-end">
                        <Link to="/my-articles" className="btn-ac btn-ac-orange">Mes articles</Link>
                        <Link to="/articles/new" className="btn-ac btn-ac-green">Créer un article</Link>
                    </div>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<form onSubmit={handleProfileUpdate} className="bg-white rounded-3xl border-4 border-acnhGreen-200 p-6 space-y-4">
						<h2 className="text-acnhGreen-600">Modifier le profil</h2>
						<div className="space-y-2">
							<label className="font-bold text-acnhNeutre-900">Nom</label>
							<input
								type="text"
								value={nom}
								onChange={(e) => setNom(e.target.value)}
								required
								minLength={2}
								maxLength={50}
								className="block w-full rounded-2xl border-2 py-2.5 px-3 bg-acnhNeutre-100 text-acnhNeutre-900"
							/>
						</div>

						<div className="space-y-2">
							<label className="font-bold text-acnhNeutre-900">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="block w-full rounded-2xl border-2 py-2.5 px-3 bg-acnhNeutre-100 text-acnhNeutre-900"
							/>
						</div>

						<button type="submit" className="btn-ac btn-ac-green w-full justify-center">
							Sauvegarder
						</button>
					</form>

					<form onSubmit={handlePasswordUpdate} className="bg-white rounded-3xl border-4 border-acnhBlue-200 p-6 space-y-4">
						<h2 className="text-acnhBlue-600">Changer le mot de passe</h2>
						<div className="space-y-2">
							<label className="font-bold text-acnhNeutre-900">Mot de passe actuel</label>
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								className="block w-full rounded-2xl border-2 py-2.5 px-3 bg-acnhNeutre-100 text-acnhNeutre-900"
							/>
						</div>

						<div className="space-y-2">
							<label className="font-bold text-acnhNeutre-900">Nouveau mot de passe</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								minLength={6}
								className="block w-full rounded-2xl border-2 py-2.5 px-3 bg-acnhNeutre-100 text-acnhNeutre-900"
							/>
						</div>

						<button type="submit" className="btn-ac btn-ac-orange w-full justify-center">
							Mettre à jour le mot de passe
						</button>
					</form>
				</div>
                <div className="flex justify-center mt-8">
                    <button onClick={handleLogout} className="btn-ac btn-ac-red">Déconnexion</button>
                </div>
			</div>
		</div>
	);
};

export default Profile;
