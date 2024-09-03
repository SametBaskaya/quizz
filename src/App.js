import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom'; // Router ile ilgili bileşenleri içe aktar
import Introduce from './pages/introduce/introduce'; // Mevcut bileşen
import Quiz from './pages/quiz/quiz'; // Quiz bileşeni
import Login from './pages/uyelik/login'; // Login bileşeni
import Register from './pages/uyelik/register'; // Register bileşeni
import { quizData } from './data/quizData'; // Soruların tanımlandığı dosyadan import

function App() {
    const [difficulty, setDifficulty] = useState("");
    const [startQuiz, setStartQuiz] = useState(false);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    startQuiz ? (
                        <Quiz questions={quizData[difficulty]} difficulty={difficulty} />
                    ) : (
                        <Introduce setDifficultyChange={setDifficulty} onStart={(selectedDifficulty) => {
                            console.log("Seçilen Zorluk Seviyesi:", selectedDifficulty);
                            setDifficulty(selectedDifficulty);
                            setStartQuiz(true);
                        }} />
                    )
                }
            />
            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            {/* Diğer yolları buraya ekleyebilirsiniz */}
        </Routes>
    );
}

export default App;
