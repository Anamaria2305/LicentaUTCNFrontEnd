import AdminNav from "../../navbars/AdminNav";
import React, { useState } from "react";
import './Scheduler.css';
import DQN from "./DQN";

import styled from 'styled-components';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Button = styled.button`
`;

const ButtonToggle = styled(Button)`
  opacity: 0.6;
  ${({ active }) =>
    active &&
    `
    opacity: 1;
  `}
`;


const Scheduler = () => {
    const types = ['DQN', 'Whale'];

    const [active, setActive] = useState('');

    return (
        <div className="scheduler-container">
            <AdminNav/>
            <ButtonGroup style={{ gap: '30px' }}>
                {types.map(type => (
                    <ButtonToggle
                        key={type}
                        active={active === type}
                        onClick={() => setActive(type)}
                    >
                        {type}
                    </ButtonToggle>
                ))}
            </ButtonGroup>

            {active === 'DQN' && (<DQN/>)}
        </div>
    );
};

export default Scheduler;
