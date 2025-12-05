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
        <header>
            <div>
                <Link to="/">
                    <img src="/logo.png" alt="Logo Animal Crossing New Horizons" height={50} />
                </Link>

                <nav>
                    <ul>
                        <li>
                            <Link to="/">Accueil</Link>
                        </li>

                        {isLoggedIn() ? (
                            <>
                                <li>
                                    <Link to="/articles/new">Créer un article</Link>
                                </li>
                                <li>
                                    <Link to="/my-articles">Mes articles</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Déconnexion</button>
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
                </nav>
            </div>
        </header>
    );
};

export default HeaderMenu;
