import { Link, useNavigate } from "react-router-dom";

const HeaderMenu = () => {
    const navigate = useNavigate();

    const isLoggedIn = () => {
        return localStorage.getItem("userToken") !== null;
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        navigate("/");
    };

    return (
        <header className="header-menu flex items-center border-[2px] border-acnhGreen-100">
            <Link to="/">
                <img src="/logo.png" alt="Logo Animal Crossing New Horizons" width={100} height="auto" />
            </Link>

            <nav>
                <ul className="flex gap-10">
                    <li>
                        <Link to="/" className="nav-link-ac">Accueil</Link>
                    </li>

                    {isLoggedIn() ? (
                        <>
                            <li>
                                <Link to="/articles/new" className="nav-link-ac">Créer un article</Link>
                            </li>
                            <li>
                                <Link to="/my-articles" className="nav-link-ac">Mes articles</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="nav-link-ac">Déconnexion</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="nav-link-ac">Connexion</Link>
                            </li>
                            <li>
                                <Link to="/register" className="nav-link-ac">Inscription</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default HeaderMenu;
