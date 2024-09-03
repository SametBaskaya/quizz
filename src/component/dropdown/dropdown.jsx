import React from 'react';

const Dropdown = ({ data, setDifficultyChange }) => {
    const handleChange = (e) => {
        setDifficultyChange(e.target.value); // Seçilen değeri parent component'e ilet
    };

    return (
        <select onChange={handleChange}>
            <option value="">Zorluk Seviyesi Seç</option> {/* Varsayılan boş seçenek */}
            {data.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                    {difficulty}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
