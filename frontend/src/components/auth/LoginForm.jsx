const LoginForm = ({ email, password, onEmailChange, onPasswordChange, onSubmit, message }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                <input type="email" placeholder="Email" value={email} onChange={onEmailChange} required />
            </div>

            <div>
                <input type="password" placeholder="Mot de passe" value={password} onChange={onPasswordChange} required />
            </div>

            <button type="submit">Se connecter</button>

            {message && <div>{message}</div>}

            <p>
                Pas encore de compte ? <a href="/register">S'inscrire</a>
            </p>
        </form>
    );
};

export default LoginForm;
