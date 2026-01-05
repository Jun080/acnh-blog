import { Link } from "react-router-dom";

const LoginForm = ({ email, password, onEmailChange, onPasswordChange, onSubmit, message }) => {
    return (
        <form onSubmit={onSubmit} className="bg-acnhOrange-50 w-full rounded-3xl border-4 border-acnhBlue-200 p-8 space-y-5 flex flex-col items-center">
            <div className="space-y-2 w-full">
                <label className="text-acnhNeutre-900">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={onEmailChange}
                    required
                    className="block w-full rounded-2xl border-2 border-acnhNeutre-200 bg-acnhNeutre-100 py-2.5 px-3 text-acnhNeutre-900"
                />
            </div>

            <div className="space-y-2 w-full">
                <label className="text-acnhNeutre-900">Mot de passe</label>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={onPasswordChange}
                    required
                    className="block w-full rounded-2xl border-2 border-acnhNeutre-200 bg-acnhNeutre-100 py-2.5 px-3 text-acnhNeutre-900"
                />
            </div>

            <button type="submit" className="btn-ac btn-ac-green">
                Se connecter
            </button>

            {message && (
                <div className="p-3 rounded-2xl bg-acnhOrange-100 border-2 border-acnhOrange-300 text-acnhOrange-900 font-bold text-center">
                    {message}
                </div>
            )}

            <p className="text-center text-acnhNeutre-700">
                Pas encore de compte ?
                <Link to="/register" className="ml-2 text-acnhBlue-700 font-bold underline">
                    S'inscrire
                </Link>
            </p>
        </form>
    );
};

export default LoginForm;
