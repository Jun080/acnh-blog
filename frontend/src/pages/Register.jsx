import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Meta } from "../components/Meta";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!nom.trim()) {
            newErrors.nom = "Le nom est obligatoire";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "L'email est obligatoire";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!password) {
            newErrors.password = "Le mot de passe est obligatoire";
        } else if (password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage("Inscription réussie");
                navigate("/login");
            } else {
                setMessage(data.message || "Erreur lors de l'inscription");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur");
        }
    };

    return (
        <>
            <Meta 
                title="Inscription | Archipel ACNH"
                description="Créez votre compte Archipel ACNH et commencez à partager vos découvertes."
                image="https://acnh-blog-1.onrender.com/logo.png"
                url="https://acnh-blog-1.onrender.com/register"
            />
        <div className="min-h-screen grid grid-cols-2">
            <div className="relative min-h-screen">
                <img src="/img/login-bg.jpg" alt="image du jeu animal crossing new horizon" className="absolute inset-0 h-full w-full object-cover" />
            </div>

            <div className="bg-acnhBlue-50 flex items-center py-16">
                <div className="container">
                    <div className="mx-44 flex flex-col gap-2">
                        <h1 className="text-acnhGreen-600">Bienvenue dans l'archipel !</h1>
                        <p className="text-acnhNeutre-900 mb-6">
                            Crée ton compte pour publier tes trouvailles, partager tes déco et suivre tes villageois préférés.
                        </p>

                        <RegisterForm
                            nom={nom}
                            email={email}
                            password={password}
                            onNomChange={(e) => setNom(e.target.value)}
                            onEmailChange={(e) => setEmail(e.target.value)}
                            onPasswordChange={(e) => setPassword(e.target.value)}
                            onSubmit={handleSubmit}
                            errors={errors}
                            message={message}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;
