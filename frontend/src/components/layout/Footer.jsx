import { Link, useLocation } from "react-router-dom";

const Footer = () => {
    useLocation();

    const isLoggedIn = () => {
        return localStorage.getItem("userToken") !== null;
    };
    
	return (
		<footer className="bg-acnhBlue-100 border-t-2 border-dashed border-acnhNeutre-200">
			<div className="container py-10 flex gap-8 items-start justify-evenly">
				<div className="space-y-3">
					<img src="/logo.png" alt="Logo" className="w-28" />
					<p className="text-acnhNeutre-700 text-sm">Un coin de paradis pour partager <br /> tes trouvailles Animal Crossing.</p>
				</div>

				<div className="space-y-2">
					<h3 className="text-acnhGreen-600 font-bold">Navigation</h3>
					<ul className="space-y-1 text-acnhNeutre-800 font-semibold">
                    {isLoggedIn() ? (
                        <>
                            <li>
                                <Link to="/articles/new">Créer un article</Link>
                            </li>
                            <li>
                                <Link to="/my-articles">Mes articles</Link>
                            </li>
                            <li>
                                <Link to="/profile" className="flex items-center gap-2">
                                    <img src="/img/icons/icon-passport.png" alt="Profil" className="w-6 h-6" />
                                    Profil
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Connexion</Link>
                            </li>
                            <li>
                                <Link to="/register">Inscription</Link>
                            </li>
                        </>
                    )}
					</ul>
				</div>

				<div className="space-y-2">
					<h3 className="text-acnhGreen-600 font-bold">Ressources</h3>
					<ul className="space-y-1 text-acnhNeutre-800 font-semibold">
						<li><a href="https://www.nintendo.com" target="_blank" rel="noreferrer" className="hover:text-acnhGreen-600">Nintendo</a></li>
						<li><a href="https://animalcrossing.nintendo.com" target="_blank" rel="noreferrer" className="hover:text-acnhGreen-600">ACNH officiel</a></li>
						<li><a href="/articles" className="hover:text-acnhGreen-600">Tous les articles</a></li>
					</ul>
				</div>

			</div>
			<div className="border-t-2 border-dashed border-acnhNeutre-200 py-4 text-center text-acnhNeutre-700 text-sm">
				© {new Date().getFullYear()} Archipel ACNH — Tous droits réservés. Animal Crossing™ est une marque déposée de Nintendo.
			</div>
		</footer>
	);
};

export default Footer;
