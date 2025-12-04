import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div>
            <h2>Inscription</h2>
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
    );
};

export default Register;
