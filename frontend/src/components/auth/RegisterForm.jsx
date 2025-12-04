const RegisterForm = ({ nom, email, password, onNomChange, onEmailChange, onPasswordChange, onSubmit, errors, message }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                <input type="text" placeholder="Nom" value={nom} onChange={onNomChange} required minLength="2" maxLength="50" />
                {errors.nom && <span>{errors.nom}</span>}
            </div>

            <div>
                <input type="email" placeholder="Email" value={email} onChange={onEmailChange} required />
                {errors.email && <span>{errors.email}</span>}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Mot de passe (min 6 caractères)"
                    value={password}
                    onChange={onPasswordChange}
                    required
                    minLength="6"
                />
                {errors.password && <span>{errors.password}</span>}
            </div>

            <button type="submit">S'inscrire</button>

            {message && <div>{message}</div>}

            <p>
                Déjà un compte ? <a href="/login">Se connecter</a>
            </p>
        </form>
    );
};

export default RegisterForm;
