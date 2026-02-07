import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Meta } from "../components/Meta";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("userToken", data.token);
                setMessage("Connexion réussie");
                navigate("/");
            } else {
                setMessage(data.message || "Email ou mot de passe incorrect");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    return (
        <>
            <Meta 
                title="Connexion | Archipel ACNH"
                description="Connectez-vous à votre compte Archipel ACNH pour publier vos articles."
                image="https://acnh-blog-1.onrender.com/logo.png"
                url="https://acnh-blog-1.onrender.com/login"
            />
        <div className="min-h-screen grid grid-cols-2">
            <div className="relative min-h-screen">
                <img src="/img/login-bg.jpg" alt="image du jeu animal crossing new horizon" className="absolute inset-0 h-full w-full object-cover" />
            </div>

            <div className="bg-acnhBlue-50 flex items-center py-16">
                <div className="container">
                    <div className="mx-44 flex flex-col gap-2">
                        <h1 className="text-acnhGreen-600">Ravi de te revoir !</h1>
                        <p className="text-acnhNeutre-900 mb-6">
                            Connecte-toi pour publier tes articles, gérer tes brouillons et suivre tes inspirations Animal Crossing.
                        </p>

                        <LoginForm
                            email={email}
                            password={password}
                            onEmailChange={(e) => setEmail(e.target.value)}
                            onPasswordChange={(e) => setPassword(e.target.value)}
                            onSubmit={handleSubmit}
                            message={message}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
