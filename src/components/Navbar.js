import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    // Butonda: <button onClick={handleLogout}>Çıkış Yap</button>

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Bütçe Takip</h1>
            </div>

            <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
            >
                Çıkış Yap 🚪
            </button>
        </nav>
    );
};

export default Navbar;