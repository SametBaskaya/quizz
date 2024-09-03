import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './introduce.css';
import sametechImage from '../../component/img/sametech.png';

const Introduce = ({ setDifficultyChange, onStart }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState(""); 
    const navigate = useNavigate();

    const difficulties = ["easy", "medium", "hard"];

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setDifficultyChange(difficulty);
    };

    const startQuiz = (difficulty) => {
        setSelectedDifficulty(difficulty);
        onStart(difficulty);  // Seçilen zorluk seviyesi onStart fonksiyonuna iletiliyor
    };

    const newMembershipclick = () => {
        navigate('/register');
    };
    const aldreayMembershipclick = () => {
        navigate('/login');
    };
    return (
        <div className="introduce-container">
            <img src={sametechImage} alt="Logo" className="logo" />
            <h1>Hoş Geldiniz!</h1>
                        <p>Bu küçük uygulamada bir zorluk seviyesi seçin ve eğlenceye başlayın!</p>

            {/* Zorluk Kartları */}
            <div className="cards">
                <div className={`card easy ${selectedDifficulty === 'easy' ? 'selected' : ''}`} onClick={() => startQuiz('easy')}>
                    <h2>Easy</h2>
                    <p>Kolay test! Tüm sorular sözel olacaktır. 1 tane basit düzeyde çıktı sorusu</p>
                    <p>Yanınıza kağıt kalem almanıza gerek yok.</p>
                    <button>Başla</button>
                </div>
                <div className={`card medium ${selectedDifficulty === 'medium' ? 'selected' : ''}`} onClick={() => startQuiz('medium')}>
                    <h2>Medium</h2>
                    <p>Orta seviye test. 3-4 tane çıktı sorusu ve 1-2 tane zor çıktı sorusu</p>
                    <p>Yüksek almak istiyorsanız yanınıza kağıt kalem almanızı tavsiye ederiz.</p>
                    <button>Başla</button>
                </div>
                <div className={`card hard ${selectedDifficulty === 'hard' ? 'selected' : ''}`} onClick={() => startQuiz('hard')}>
                    <h2>Hard</h2>
                    <p>Zor seviye! Zor seviyede sözel ve çıktı soruları. 5-6 tane çıktı sorusu ve sadece 1-2 tanesi orta düzey çıktı sorusu. O da ısındırmak için :D</p>
                    <p>Kağıt kalemsiz girmenizi asla tavsiye etmiyoruz!</p>
                    <button>Başla</button>
                </div>
            </div>

            {/* Üyelik ile ilgili bilgilendirme */}
            <div className="membership-info">
                <p>Daha ayrıntılı seviye ölçümü yapmak için üye olmanız gerekmektedir.</p>
                <button onClick={newMembershipclick}>Üye Olmak İçin Tıklayın</button>
            </div>

            <div className="membership-info">
                <p>Hesabın var mı giriş yap</p>
                <button onClick={aldreayMembershipclick}>Giriş Yapmak İçin Tıklayın</button>
            </div>
        </div>
    );
}

export default Introduce;