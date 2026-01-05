import { Link } from "react-router-dom";

const RegisterForm = ({ nom, email, password, onNomChange, onEmailChange, onPasswordChange, onSubmit, errors, message }) => {
    return (
        <form onSubmit={onSubmit} className="bg-acnhOrange-50 w-full rounded-3xl border-4 border-acnhGreen-200 p-8 space-y-5 flex flex-col items-center">
            <div className="space-y-2 w-full">
                <label className="font-bold text-acnhNeutre-900">Nom</label>
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={onNomChange}
                    required
                    minLength="2"
                    maxLength="50"
                    className="w-full px-4 py-3 border-2 border-acnhNeutre-200 rounded-2xl bg-acnhNeutre-100 text-acnhNeutre-900 focus:border-acnhGreen-300 focus:outline-none"
                />
                {errors.nom && <span className="text-acnhOrange-800 font-bold">{errors.nom}</span>}
            </div>

            <div className="space-y-2 w-full">
                <label className="font-bold text-acnhNeutre-900">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={onEmailChange}
                    required
                    className="w-full px-4 py-3 border-2 border-acnhNeutre-200 rounded-2xl bg-acnhNeutre-100 text-acnhNeutre-900 focus:border-acnhGreen-300 focus:outline-none"
                />
                {errors.email && <span className="text-acnhOrange-800 font-bold">{errors.email}</span>}
            </div>

            <div className="space-y-2 w-full">
                <label className="font-bold text-acnhNeutre-900">Mot de passe</label>
                <input
                    type="password"
                    placeholder="Mot de passe (min 6 caractères)"
                    value={password}
                    onChange={onPasswordChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border-2 border-acnhNeutre-200 rounded-2xl bg-acnhNeutre-100 text-acnhNeutre-900 focus:border-acnhGreen-300 focus:outline-none"
                />
                {errors.password && <span className="text-acnhOrange-800 font-bold">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-ac btn-ac-green w-full justify-center">
                S'inscrire
            </button>

            {message && (
                <div className="p-3 rounded-2xl bg-acnhOrange-100 border-2 border-acnhOrange-300 text-acnhOrange-900 font-bold text-center">
                    {message}
                </div>
            )}

            <p className="text-center text-acnhNeutre-700">
                Déjà un compte ?
                <Link to="/login" className="ml-2 text-acnhBlue-700 font-bold underline">
                    Se connecter
                </Link>
            </p>
        </form>
    );
};

export default RegisterForm;
