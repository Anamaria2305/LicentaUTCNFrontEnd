import AdminNav from "../../navbars/AdminNav";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../../css/Login.css";
import { useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import { Modal } from 'react-responsive-modal';
const Experiment = () => {

    const [charginStationArray, setcharginStationArray] = useState([3,5])
    const [scheduleHoursArray, setscheduleHoursArray] = useState([3,5])
    const [cars, setCars] = useState();
    const [startHour, setStartHour] = useState(0);
    const [hours, setHours] = useState(scheduleHoursArray[0]);
    const [cs, setCS] = useState(charginStationArray[0]);
    const [disbl, setDis] = useState(false);
    const [selectedOption, setSelectedOption] = useState('charge');
    const [selectedOptionAlg, setSelectedOptionAlg] = useState('DQN');


    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);



    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
      };

    const handleRadioChangeAlg = (event) => {
        setSelectedOptionAlg(event.target.value);
      };

    const handleExperiments = async (e) => {
        e.preventDefault()
        console.log(selectedOptionAlg)
        console.log(cs)
        console.log(hours)
        console.log(cars)
        console.log(selectedOption)
        console.log(startHour)
        if(selectedOptionAlg === "DQN"){
            onOpenModal()
        } else if(selectedOptionAlg==="WOA"){

        } else {
            showToastMessage("Something went wrong with the selection.")
        }

    }

    const onChangeCars = (e) => {
        setCars(e.target.value)
        var nr = e.target.value
        if(nr > cs * hours){
         setDis(true)
        }
        else
        {
        setDis(false)
        }
      }
    
    const onChangeCS = (e) => {
        setCS(e.target.value)
        if(cars > e.target.value * hours){
         setDis(true)
        }
        else
        {
        setDis(false)
        }
    }

    const onChangeHours = (e) => {
        setHours(e.target.value)
        if(cars > cs * e.target.value){
            setDis(true)
           }
           else
           {
           setDis(false)
           }
    }

    const onChangeStart = (e) => {
        setStartHour(e.target.value)
    }
    
    const showToastMessage = (message) =>
      toast.error(message, {
          position: toast.POSITION.TOP_CENTER
      });

      const renderHoursOptions = () => {
        const options = [];
    
        for (let hour = 0; hour < (24-(hours-1)); hour++) {
          const formattedHour = hour.toString().padStart(2, '0');
          options.push(
            <option key={formattedHour} value={hour}>
              {formattedHour}:00
            </option>
          );
        }
    
        return options;
      };

    return (
        <div className="loginpage">
        <AdminNav/>
        <div className="car-form">
        <ToastContainer />
        <Card className={Classes.ELEVATION_3}>
           <Form onSubmit={handleExperiments}>
               <fieldset className="fieldset-bordered">
                   <Form.Label>
                   <legend>Make experiments</legend>
                   </Form.Label>
                   <Form.Group style={{marginTop:"5px"}}>
                   <Form.Label> Choose algorithm: </Form.Label>
                   <div>
                   <Form.Check type="radio" inline value="DQN" label="DQN" name="radioGroup1" defaultChecked onChange={handleRadioChangeAlg}/>
                   <Form.Check type="radio" inline value="WOA" label="WOA" name="radioGroup1" onChange={handleRadioChangeAlg}/>
                   </div></Form.Group>
                   <Form.Group>
                       <Form.Label> Number of Charging Station </Form.Label>
                       <Form.Select aria-label="Default select example" name= "ncs" style={{ width: "100%" }}
                        onChange={(e) => onChangeCS(e)}
                       >
                        { charginStationArray.map((charginStation) => (
                                   <option>{charginStation}</option>
                               ))
                        }
                    </Form.Select>
                    </Form.Group>
                    <Form.Group>
                       <Form.Label> Scheduling window </Form.Label>
                       <Form.Select aria-label="Default select example" name= "sw" style={{ width: "100%" }}
                        onChange={(e) => onChangeHours(e)}>
                        { scheduleHoursArray.map((hour) => (
                                   <option>{hour}</option>
                               ))} 
                    </Form.Select>
                    </Form.Group>
                   <Form.Group>
                       <Form.Label>Number of Electric Vehicles:</Form.Label>
                       <Form.Control type="number" required name="cars"  onChange={(e) => onChangeCars(e)}
                           placeholder="Electric Vehicles" />
                   </Form.Group>
                   <Form.Group style={{marginTop:"5px"}}>
                   <Form.Label> Choose energy curve: </Form.Label>
                   <div>
                   <Form.Check type="radio" inline value="charge" label="Charge" name="radioGroup" defaultChecked onChange={handleRadioChange}/>
                   <Form.Check type="radio" inline value="discharge" label="Discharge" name="radioGroup" onChange={handleRadioChange}/>
                   </div></Form.Group>
                   <Form.Group controlId="hourSelect">
                   <Form.Label>Select Starting Hour:</Form.Label>
                   <Form.Select style={{ width: "100%" }}  onChange={(e) => onChangeStart(e)}>
                   {renderHoursOptions()}
                   </Form.Select>
                   </Form.Group>
                   <Form.Group style={{display:"flex",flexDirection:"column"}}>
                   {disbl && <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>Too Many Electrical Vehicles</Form.Label>}
                   </Form.Group>
                   <Button className="but" variant="primary" disabled={disbl} type="submit" style={{ margin: "10px" }}>
                        See scheduling
                   </Button>
               </fieldset>
           </Form>
       </Card>
   </div>
                    
        <Modal open={open} onClose={onCloseModal} center>
        <h2>Simple centered modalasdvghsabjdhbs
        dcgfvbhsdchfvbsdcfvgbhnjhgfsaxvgfnh
        jkmhbgfdsvgfhnyjm</h2>
        <h2>Simple centered modalasdvghsabjdhbs
        dcgfvbhsdchfvbsdcfvgbhnjhgfsaxvgfnh
        jkmhbgfdsvgfhnyjm</h2>
        <h2>Simple centered modalasdvghsabjdhbs
        dcgfvbhsdchfvbsdcfvgbhnjhgfsaxvgfnh
        jkmhbgfdsvgfhnyjm</h2>
        </Modal>
</div>
    );
};

export default Experiment;