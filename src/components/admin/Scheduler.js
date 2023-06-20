import AdminNav from "../../navbars/AdminNav";
import React, { useState } from "react";
import './Scheduler.css';
import DQN from "./DQN";
import { Button} from "react-bootstrap";
import styled from 'styled-components';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import WOA from "./WOA";


const Scheduler = () => {

  const [button1Disabled, setButton1Disabled] = useState(false);
  const [button2Disabled, setButton2Disabled] = useState(false);
  const [isFirstClick, setFirstClick] = useState(false);

  const handleButton1Click = () => {
    setButton1Disabled(true);
    setButton2Disabled(false);
    setFirstClick(true)
  };

  const handleButton2Click = () => {
    setButton1Disabled(false);
    setButton2Disabled(true);
    setFirstClick(true)
  };

    return (
        <div>
        <AdminNav/>
        <div style={{display:"flex",gap:"100px", justifyContent: 'center', alignItems: 'center'}}>   
            <Button variant='primary' disabled={button1Disabled} style={{margin:'20px'}}
        onClick={handleButton1Click}>
            Deep Q-Network
            </Button>
            <Button variant='primary' disabled={button2Disabled} style={{margin:'20px'}}
        onClick={handleButton2Click}>
            Whale Optimization
            </Button>
            </div>
        <div>
            {(isFirstClick && button1Disabled) === true && (<DQN/>)}
        </div>
        <div className="woa-container">
            {( isFirstClick && button2Disabled) === true && (<WOA/>)}
        </div>
        </div>
    );
};

export default Scheduler;
