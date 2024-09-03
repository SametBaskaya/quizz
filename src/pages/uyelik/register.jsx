import React, { useState } from 'react';

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        // Kayıt işlemini burada gerçekleştirebiliriz (API ile ya da yerel depolama kullanarak)
        // Basit bir örnek: kullanıcıyı localStorage'da saklamak
        localStorage.setItem('user', JSON.stringify({ email, password }));
        onRegister(); // Kayıt olduktan sonra kullanıcıyı giriş yapmış kabul edeceğiz
    };

    return (
        <div className="register-container">
            <h2>Kayıt Ol</h2>
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
            <button onClick={handleRegister}>Kayıt Ol</button>
        </div>
    );
};

export default Register;
