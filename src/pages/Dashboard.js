import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `transactions_${currentUser?.email}`; // Her kullanıcıya özel anahtar

    const [transactions, setTransactions] = useState(() => {
        // Sadece bu kullanıcıya ait verileri getir
        const saved = localStorage.getItem(userKey);
        return saved ? JSON.parse(saved) : [];
    });

    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');
    const [category, setCategory] = useState('Diğer');
    const [filter, setFilter] = useState('all');


    const categoryIcons = {
        Maaş: '💰',
        Market: '🛒',
        Kira: '🏠',
        Fatura: '⚡',
        Eğlence: '🎬',
        Ulaşım: '🚗',
        Yemek: '🍔',
        Diğer: '📦'
    };

    useEffect(() => {
        // Sadece bu kullanıcıya ait verileri kaydet
        localStorage.setItem(userKey, JSON.stringify(transactions));
    }, [transactions, userKey]);

    // Filtreleme Mantığı
    const filteredTransactions = transactions.filter(t => {
        if (filter === 'income') return t.type === 'income';
        if (filter === 'expense') return t.type === 'expense';
        return true;
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    const chartData = {
        labels: ['Gelir', 'Gider'],
        datasets: [{
            data: [totalIncome, totalExpense],
            backgroundColor: ['#22c55e', '#ef4444'],
            hoverOffset: 4
        }]
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!text || !amount) return alert("Eksik bilgi!");
        const newTransaction = {
            id: Date.now(),
            text,
            amount: Number(amount),
            type,
            category,
            date: new Date().toLocaleDateString('tr-TR')
        };
        setTransactions([newTransaction, ...transactions]);
        setText(''); setAmount('');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />


            <main className="max-w-6xl mx-auto p-6">
                {/* Özet Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center md:text-left">
                    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
                        <p className="text-blue-100 text-sm">Bakiye</p>
                        <h3 className="text-3xl font-bold">₺{balance.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
                        <p className="text-gray-400 text-sm">Gelir</p>
                        <h3 className="text-3xl font-bold text-green-600">₺{totalIncome.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-red-500">
                        <p className="text-gray-400 text-sm">Gider</p>
                        <h3 className="text-3xl font-bold text-red-600">₺{totalExpense.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        {/* Form */}
                        <form onSubmit={handleAddTransaction} className="bg-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold mb-4">İşlem Ekle</h4>
                            <div className="space-y-3">
                                <input type="text" placeholder="Açıklama" className="w-full p-3 bg-gray-50 rounded-xl outline-none border focus:border-blue-500" value={text} onChange={(e) => setText(e.target.value)} />
                                <input type="number" placeholder="Miktar" className="w-full p-3 bg-gray-50 rounded-xl outline-none border focus:border-blue-500" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                <select className="w-full p-3 bg-gray-50 rounded-xl border" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="income">Gelir</option>
                                    <option value="expense">Gider</option>
                                </select>
                                {/* Kategori Seçimi */}
                                <select className="w-full p-3 bg-gray-50 rounded-xl border text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {Object.keys(categoryIcons).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Ekle</button>
                            </div>
                        </form>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold mb-4 text-center">Dağılım</h4>
                            <Doughnut data={chartData} options={{ cutout: '70%' }} />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[500px]">
                            {/* Filtre Butonları */}
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold">İşlemler</h4>
                                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                                    <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Hepsi</button>
                                    <button onClick={() => setFilter('income')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'income' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}>Gelir</button>
                                    <button onClick={() => setFilter('expense')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'expense' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}>Gider</button>
                                </div>
                            </div>

                            {/* Dinamik Liste */}
                            <div className="space-y-3">
                                {filteredTransactions.map((t) => (
                                    <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all group">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{categoryIcons[t.category] || '📦'}</span>
                                            <div>
                                                <p className="font-bold text-gray-800">{t.text}</p>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.category} • {t.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'income' ? '+' : '-'}₺{t.amount.toLocaleString()}
                                            </span>
                                            <button onClick={() => setTransactions(transactions.filter(item => item.id !== t.id))} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;