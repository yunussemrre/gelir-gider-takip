import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // Mevcut kullanıcıları al
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Kullanıcı zaten var mı kontrol et
        if (existingUsers.find(u => u.email === email)) {
            return alert("Bu e-posta zaten kayıtlı!");
        }

        // Yeni kullanıcıyı ekle
        const newUser = { email, password };
        localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate('/');
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Üye Ol</h2>
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                    <input
                        type="email" placeholder="E-posta" required
                        className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Şifre" required
                        className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">
                        Kayıt Ol
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    Zaten hesabın var mı?{' '}
                    <span
                        onClick={() => navigate('/')} // Giriş sayfasına (kök dizin) geri döner
                        className="text-purple-600 cursor-pointer font-bold hover:underline"
                    >
                        Giriş Yap
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;