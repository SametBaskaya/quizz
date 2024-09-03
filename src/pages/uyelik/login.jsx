import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email === email && user.password === password) {
            onLogin();
        } else {
            alert('Giriş bilgileri hatalı');
        }
    };

    return (
        <div className="login-container">
            <h2>Giriş Yap</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Giriş Yap</button> {/* Tek button etiketi yeterli */}
        </div>
    );
};

export default Login;
