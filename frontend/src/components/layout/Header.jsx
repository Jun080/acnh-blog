import { Link, useNavigate, useLocation } from "react-router-dom";

const HeaderMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = () => {
        return localStorage.getItem("userToken") !== null;
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header-menu flex items-center border-[2px] border-acnhGreen-100">
            <Link to="/">
                <img src="/logo.png" alt="Logo Animal Crossing New Horizons" width={100} height="auto" />
            </Link>

            <nav>
                <ul className="flex gap-10">
                    <li>
                        <Link to="/" className={`nav-link-ac ${isActive("/") ? "nav-link-ac-active" : ""}`}>Accueil</Link>
                    </li>

                    {isLoggedIn() ? (
                        <>
                            <li>
                                <Link to="/articles/new" className={`nav-link-ac ${isActive("/articles/new") ? "nav-link-ac-active" : ""}`}>Créer un article</Link>
                            </li>
                            <li>
                                <Link to="/my-articles" className={`nav-link-ac ${isActive("/my-articles") ? "nav-link-ac-active" : ""}`}>Mes articles</Link>
                            </li>
                            <li>
                                <Link to="/profile" className={`nav-link-ac flex items-center gap-2 ${isActive("/profile") ? "nav-link-ac-active" : ""}`}>
                                    <img src="/img/icons/icon-passport.png" alt="Profil" className="w-6 h-6" />
                                    Profil
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className={`nav-link-ac ${isActive("/login") ? "nav-link-ac-active" : ""}`}>Connexion</Link>
                            </li>
                            <li>
                                <Link to="/register" className={`nav-link-ac ${isActive("/register") ? "nav-link-ac-active" : ""}`}>Inscription</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default HeaderMenu;
