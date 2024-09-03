import React, { useState, useEffect } from 'react';
import './quiz.css';

const Quiz = ({ questions = [], difficulty }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0); // Doğru cevap sayısını tutmak için
    const [incorrectAnswers, setIncorrectAnswers] = useState(0); // Yanlış cevap sayısını tutmak için
    const [unansweredCount, setUnansweredCount] = useState(questions.length); // Başlangıçta tüm sorular boş
    const [showScore, setShowScore] = useState(false);
    const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
    const [timer, setTimer] = useState(30);
    const [correctionTimer, setCorrectionTimer] = useState(0);
    const [isCorrectionMode, setIsCorrectionMode] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [correctionCount, setCorrectionCount] = useState(Array(questions.length).fill(0)); // Düzeltme hakkını izleyen dizi

    // Zorluk seviyesine göre puan hesaplama fonksiyonu
    const getPointsForDifficulty = (zorluk) => {
        if (zorluk === 1) return 5;
        if (zorluk === 2) return 10;
        if (zorluk === 3) return 15;
        return 0;
    };

    // Zorluk seviyesine göre zamanlayıcıyı ayarlayan fonksiyon
    const startTimer = () => {
        const zorluk = questions[currentQuestionIndex]?.zorluk;
    
        if (difficulty === "easy") {
            if (zorluk === 1) {
                setTimer(30);
            } else if (zorluk === 2) {
                setTimer(45);
            } else if (zorluk === 3) {
                setTimer(60);
            }
        } else if (difficulty === "medium") {
            if (zorluk === 1) {
                setTimer(45);
            } else if (zorluk === 2) {
                setTimer(60);  // 1 dakika
            } else if (zorluk === 3) {
                setTimer(75);  // 1 dakika 15 saniye
            }
        } else if (difficulty === "hard") {
            if (zorluk === 1) {
                setTimer(45);
            } else if (zorluk === 2) {
                setTimer(90);  // 1 dakika 30 saniye
            } else if (zorluk === 3) {
                setTimer(120); // 2 dakika
            }
        }
    };

    useEffect(() => {
        if (!isCorrectionMode) {
            startTimer();
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer > 0) {
                        return prevTimer - 1;
                    } else {
                        handleTimeout();
                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentQuestionIndex, isCorrectionMode, difficulty]); // difficulty ekleyerek bağımlılığı artırdım

    const handleTimeout = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setShowScore(true); // Son soruysa ve zaman bittiğinde sonuçları göster
        } else if (isCorrectionMode) {
            setIsCorrectionMode(false);
            handleNextClick(); // Süre bitince otomatik geçiş
        } else {
            handleNextClick(); // Normal geçiş
        }
    };

    const handleAnswerOptionClick = (option) => {
        setSelectedOption(option); // Geçici olarak cevabı seç
    };

    const handleNextClick = () => {
        if (selectedOption === null) return; // Eğer bir cevap seçilmediyse ilerlemeye izin verme

        const newUserAnswers = [...userAnswers];
        const previousAnswer = newUserAnswers[currentQuestionIndex];

        if (previousAnswer === null) {
            // Eğer kullanıcı cevap seçmediyse
            setUnansweredCount(prevUnanswered => prevUnanswered - 1);
        }

        // Eğer daha önce bir cevap verilmişse, doğru/yanlış sayısını geri al
        if (previousAnswer !== null) {
            if (previousAnswer === questions[currentQuestionIndex]?.answer) {
                setScore(prevScore => prevScore - getPointsForDifficulty(questions[currentQuestionIndex]?.zorluk)); // Skoru geri al
                setCorrectAnswers(prevCorrect => prevCorrect - 1);
            } else if (incorrectAnswers > 0) {
                setIncorrectAnswers(prevIncorrect => prevIncorrect - 1);
            }
        }

        // Yeni cevabı kaydet
        newUserAnswers[currentQuestionIndex] = selectedOption;
        setUserAnswers(newUserAnswers);

        // Yeni cevaba göre doğru/yanlış sayısını güncelle
        if (selectedOption === questions[currentQuestionIndex]?.answer) {
            setScore(prevScore => prevScore + getPointsForDifficulty(questions[currentQuestionIndex]?.zorluk)); // Skoru ekle
            setCorrectAnswers(prevCorrect => prevCorrect + 1);
        } else {
            setIncorrectAnswers(prevIncorrect => prevIncorrect + 1);
        }

        setSelectedOption(null); // Geçici seçimi temizle

        const points = getPointsForDifficulty(questions[currentQuestionIndex]?.zorluk);
        console.log("Zorluk seviyesi:", questions[currentQuestionIndex]?.zorluk);
        console.log("Bu soru için verilen puan:", points);
        
        // Sonraki soruya geç
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setShowScore(true); // Son soruysa sonuçları göster
        }
    };

    const handlePreviousClick = () => {
        if (currentQuestionIndex > 0 && correctionCount[currentQuestionIndex] < 1) { // Eğer bu soruya daha önce dönülmemişse
            setIsCorrectionMode(true);
            setCorrectionTimer(5);
            setCorrectionCount(prevCorrectionCount => {
                const newCorrectionCount = [...prevCorrectionCount];
                newCorrectionCount[currentQuestionIndex] += 1; // Bu soru için düzeltme hakkını kullanılmış olarak işaretle
                return newCorrectionCount;
            });
            setCurrentQuestionIndex(prevIndex => prevIndex - 1); // Bir önceki soruya git

            const interval = setInterval(() => {
                setCorrectionTimer(prevTimer => {
                    if (prevTimer > 1) {
                        return prevTimer - 1;
                    } else {
                        clearInterval(interval);
                        setIsCorrectionMode(false);
                        setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Zaman dolduğunda mevcut soruya dön
                        return 0;
                    }
                });
            }, 1000);
        }
    };

    const handleQuitClick = () => {
        setShowScore(true); // Testi bitir ve sonuç ekranını göster
    };

    const getStatus = () => {
        if (totalScore < 50) {
            return "Kötü";
        } else if (score < 60) {
            return "Orta";
        } else if (score < 80) {
            return "İyi";
        }  else if (score < 90) {
            return "Oldukça İyi";
        } else {
            return "Mükemmel";
        }
    };

    const getStatusColor = () => {
        if (totalScore < 50) {
            return "red";
        } else if (score < 60) {
            return "pink";
        } else if (score < 80) {
            return "orange";
        }  else if (score < 90) {
            return "blue";
        } else {
            return "green";
        }
    };

    const totalScore = score; // Artık totalScore, zorluklara göre doğru bir şekilde hesaplanıyor

    const getScoreExplanation = () => {
        if (difficulty === "medium") {
            if (totalScore < 50) {
                return "Orta seviyede düşük puan aldınız bir sonraki seviyeye geçemezseniz temelinizi güçlendirmenizi tavsiye ederiz";
            }else if (totalScore >= 50 && totalScore < 60) {
                return "Orta seviyede geçer bir puan aldınız, iyi bir sonuç da değil kötü bir sonuç da değil. Kendinizi geliştirmelisiniz";
            } else if (totalScore >= 60 && totalScore < 70) {
                return "Orta seviyede iyi bir puan aldınız, ama geliştirmeye devam edin. Bir sonraki seviyeye geçebilirsiniz ama geliştirmeniz gerekiyor";
            } else if (totalScore >= 70 && totalScore < 90) {
                return "Orta seviyede yüksek bir puan aldınız, gayet iyi!. Bir sonraki seviyeye geçebilirsiniz";
            } else {
                return "Orta zorlukta mükemmel bir puan aldınız! Tebrikler!. Bir sonraki seviyede bekleriz";
            }
        } else if (difficulty === "easy") {
            if (totalScore < 50) {
                return "Kolay zorlukta düşük puan aldınız. Temel konularda gelişmelisiniz.";
            } else if (totalScore >= 50 && totalScore < 60) {
                return "Orta seviyede geçer bir puan aldınız, iyi bir sonuç da değil kötü bir sonuç da değil. Kendinizi geliştirmelisiniz";
            } else if (totalScore >= 50 && totalScore < 70) {
                return "Kolay seviyede iyi bir puan aldınız, ama geliştirmeye devam edin.";
            } else if (totalScore >= 70 && totalScore < 90) {
                return "Kolay seviyede yüksek bir puan aldınız, gayet iyi!. Diğer seviyeye geçebilirsiniz";
            } else {
                return "Kolay zorlukta mükemmel bir puan aldınız! Tebrikler!. Temeliniz sağlam bir sonraki seviyeden devam edebilirsiniz";
            }
        } else {
            if (totalScore < 50) {
                return "Zor seviyede düşük puan aldınız daha bu seviye için hazır değilsiniz.";
            }else if (totalScore >= 50 && totalScore < 60) {
                return "Zor seviyede geçer bir puan aldınız, bu seviye de bu puan normal endişelenmeyin. Biraz orta seviye uygulamalar yaparak kendinizi geliştirip tekrar deneyebilirsiniz ";
            } else if (totalScore >= 50 && totalScore < 70) {
                return "Zor seviyede gayet iyi puan aldınız ama gelişmeye devam etmelisiniz";
            } else if (totalScore >= 70 && totalScore < 90) {
                return "Tebrikler! Zor seviyede yüksek bir puan aldınız bundan sonrası için uygulamalar ile pratik yapmanızı öneririz.";
            } else {
                return "Tebrikler!👏👏 Harika bir sonuç yaptınız! Artık javayı iyi biliyorum diyebilirsiniz... Pratik ile uygulama yaparak daha profesyonel hale gelebilirsiniz";
            }
        }
    };

    return (
        <div className="quiz-container">
            {questions.length === 0 ? (
                <div>Geçerli sorular bulunamadı. Lütfen tekrar deneyin.</div>
            ) : showScore ? (
                <div className="score-section">
                    <h2>Sonuçlar</h2>
                    <table className="score-table">
                        <thead>
                            <tr>
                                <th>Durum</th>
                                <th>Doğru Sayısı</th>
                                <th>Yanlış Sayısı</th>
                                <th>Boş Sayısı</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ color: getStatusColor() }}>{getStatus()}</td>
                                <td>{correctAnswers}</td>
                                <td>{incorrectAnswers}</td>
                                <td>{unansweredCount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="score-explanation-table">
                        <thead>
                            <tr>
                                <th>Puan</th>
                                <th>Açıklama</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{totalScore}</td>
                                <td>{getScoreExplanation()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="question-section">
                    <div className="question-count">
                        <span>Soru {currentQuestionIndex + 1}</span> / {questions.length}
                    </div>
                    <div className="timer">Kalan Süre: {timer} saniye</div>
                    {isCorrectionMode && (
                        <div className="correction-timer">
                            Düzeltme süresi: {correctionTimer} saniye
                        </div>
                    )}
                    {questions[currentQuestionIndex]?.image && (
                        <img 
                            src={questions[currentQuestionIndex]?.image} 
                            alt="Question visual" 
                            className="question-image"
                        />
                    )}
                    <div className="question-text">{questions[currentQuestionIndex]?.question}</div>
                    <div className="question-points">
                        {`(${getPointsForDifficulty(questions[currentQuestionIndex]?.zorluk)} puan)`}
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <button 
                                key={index} 
                                className="answer-button" 
                                onClick={() => handleAnswerOptionClick(option)}
                                style={{
                                    backgroundColor: selectedOption === option ? '#cce5ff' : ''
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <div className="navigation-buttons">
                        <button
                            className="prev-button"
                            onClick={handlePreviousClick}
                            disabled={currentQuestionIndex === 0 || isCorrectionMode || correctionCount[currentQuestionIndex] > 0} // Eğer düzeltme hakkı kullanıldıysa pasif olur
                        >
                            Previous
                        </button>
                        <button
                            className="next-button"
                            onClick={handleNextClick}
                            disabled={selectedOption === null} // Eğer cevap seçilmemişse "Next" pasif olur
                        >
                            Next
                        </button>
                        <button 
                            className="quit-button" 
                            onClick={handleQuitClick} // Sonuç ekranını göstermek için sadece quit butonunu kullanıyoruz
                        >
                            Quit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
