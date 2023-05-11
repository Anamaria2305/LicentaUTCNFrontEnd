import AdminNav from "../../navbars/AdminNav";
import React, { useState } from "react";
import './Scheduler.css';

const Scheduler = () => {
    const [selectedOption, setSelectedOption] = useState('DQN');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="scheduler-container">
            <AdminNav/>
            <select value={selectedOption} onChange={handleOptionChange} className="scheduler-dropdown">
                <option value="DQN">DQN</option>
                <option value="Whale">Whale</option>
            </select>
        </div>
    );
};

export default Scheduler;
