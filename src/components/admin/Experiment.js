import AdminNav from "../../navbars/AdminNav";
import React from "react";
import axios from "axios";
import { Button, Form, Table } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../../css/Login.css";
import { useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import { Modal } from 'react-responsive-modal';
import { Line } from 'react-chartjs-2';
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
const Experiment = () => {

    const [charginStationArray, setcharginStationArray] = useState([1,2,3,4])
    const [scheduleHoursArray, setscheduleHoursArray] = useState([1,2,3,4,5,6,7,8,9,10,20])
    const [cars, setCars] = useState();
    const [startHour, setStartHour] = useState(0);
    const [hours, setHours] = useState(scheduleHoursArray[0]);
    const [cs, setCS] = useState(charginStationArray[0]);
    const [disbl, setDis] = useState(false);
    const [selectedOption, setSelectedOption] = useState('charge');
    const [selectedOptionAlg, setSelectedOptionAlg] = useState('DQN');
    const [messagePlugs, setMsg]  = useState('Plugs are equal to the charging stations');

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const [openWOA, setOpenWOA] = useState(false);
    const onOpenWOAModal = () => setOpenWOA(true);
    const onCloseWOAModal = () => setOpenWOA(false);

    const [schedule,setSchedule] = useState([])
    const [fitnessWOA,setFitnessWOA] = useState([])
    const [oldediff,setoldediff] = useState([])
    const [carsCharge,setCarCharge] = useState([])
    const [carsChargeHours,setCarChargeHours] = useState([])
    const [csresponse,setCsresponse] = useState([])
    const [ore,setore] = useState([])
    const [msjStatii,setmsjStatii] = useState([])
    const [correlation,setCorr] = useState()
    const [convRate,setConvRate] = useState()
    const [euclidean,setEuclidean] = useState([])
    const [timeElapsed,setTimeElapsed] = useState()
    const [constraintsPenalties,setConstraintsPenalties] = useState([])
    const [iterations,setIterations] = useState([])
    const locations = [
        { latitude:46.783268112023215,longitude: 23.62194039431511},
        { latitude:46.74841349371496, longitude:23.596804554098277},
        { latitude:46.776576313581614, longitude:23.60415708143363 },
        { latitude: 46.75977259501111, longitude:23.563878677375598 },
      ];

      const LINEdata = {
      labels: ore,
      datasets: [
            {

                label: "Energy Curve Profile (KW)",
                data: oldediff,
                backgroundColor: ["blue"],
                borderColor: ["blue"],
                borderWidth: 2.5,
                fill: false,
                tension: 0.4,
            },
            {
                label: "Energy Profile Given By EV (KW)",
                data: carsCharge,
                backgroundColor: ["magenta"],
                borderColor: ["magenta"],
                borderWidth: 2.5,
                fill: false,
                tension: 0.4,
            }
        ],
    };

    const fitnessData = {
        labels:iterations,
        datasets: [
              {
                  label: "Fitness Evolution",
                  data: fitnessWOA,
                  backgroundColor: ["green"],
                  borderColor: ["green"],
                  borderWidth: 2.5,
                  fill: false,
                  tension: 0.4,
              }
          ],
      };

      const euclideanData = {
        labels:iterations,
        datasets: [
              {
                  label: "Euclidean Distance Diversity Each Iterations",
                  data: euclidean,
                  backgroundColor: ["green"],
                  borderColor: ["green"],
                  borderWidth: 2.5,
                  fill: false,
                  tension: 0.4,
              }
          ],
      };


    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
      };

    const handleRadioChangeAlg = (event) => {
        setSelectedOptionAlg(event.target.value);
        if(event.target.value == 'WOA'){
            setMsg("Plugs are two times the charging stations")
        }
      };

    const handleExperiments = async (e) => {
        e.preventDefault()
        if(selectedOptionAlg === "DQN"){
            onOpenModal()
        } else if(selectedOptionAlg==="WOA"){
            const params = new URLSearchParams({
                timeSlots: parseInt(hours),
                startTime: parseInt(startHour),
                chargeType: selectedOption, 
                maxCars: parseInt(cars), 
                chargingStations: parseInt(cs)
              }).toString();
              const params2 = new URLSearchParams({
                plugs: parseInt(hours),
                startTime:parseInt(startHour),
                chargeType: selectedOption
              }).toString();
              try {
                var response = await axios.get("http://localhost:8080/ev/ediff?"+params2)
                var res= await axios.get("http://localhost:8080/ev/exp?"+params)
                let copieore = []
                setoldediff(response.data)
                for(let i=8;i<response.data.length+8;i++){
                copieore.push(i)
                }
                setore(copieore)
                let copieiter = []
                for(let i=0;i<res.data[7][0].length;i++){
                    copieiter.push(i)
                }
                setIterations(copieiter)
                setCarCharge(res.data[1]);
                setSchedule(res.data[2][0])
                setCarChargeHours(res.data[3][0])
                setCsresponse(res.data[4][0])
                setCorr(res.data[5][0])
                setmsjStatii(res.data[6][0])
                setFitnessWOA(res.data[7][0])
                setConvRate(res.data[8][0])
                setTimeElapsed(res.data[9][0])
                setConstraintsPenalties(res.data[10][0])
                setEuclidean(res.data[11][0])
                onOpenWOAModal()
              } catch (error) {
                
                showToastMessage("Something went wrong with the experiment.")
                
              }
        } else {
            showToastMessage("Something went wrong with the selection.")
        }

    }

    const onChangeCars = (e) => {
        setCars(e.target.value)
        let plugs = cs
        if(selectedOptionAlg=='WOA'){
            plugs = cs*2
        }
        var nr = e.target.value
        if(nr > plugs * hours){
         setDis(true)
        }
        else
        {
        setDis(false)
        }
      }
    
    const onChangeCS = (e) => {
        setCS(e.target.value)
        let plugs = e.target.value
        if(selectedOptionAlg=='WOA'){
            plugs = e.target.value*2
        }
        if(cars > plugs * hours){
         setDis(true)
        }
        else
        {
        setDis(false)
        }
    }

    const onChangeHours = (e) => {
        setHours(e.target.value)
        let plugs = cs
        if(selectedOptionAlg=='WOA'){
            plugs = cs*2
        }
        if(cars > plugs * e.target.value){
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
                       <Form.Label> Number of Charging Station ({messagePlugs}) </Form.Label>
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

        <Modal open={openWOA} onClose={onCloseWOAModal}  center styles={{
        modal: {
        maxWidth: '800px', // Adjust the maximum width as needed
        width: '90%', // Adjust the width as needed
        },
        }}>
        <div><h3>Energy Profiles</h3></div>
        <div><Line data={LINEdata}/> </div>
        {correlation && <div style={{display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto',marginTop:"10px",marginBottom:"10px"}}>
            <h5>Correlation coefficient between the curves is: <b>{correlation}</b></h5>
            </div>}
        <div><h3>Fitness Evolution</h3></div>
        <div> 
        <Line data={fitnessData}/>
        </div>
        <div><h3>Euclidean Distance Diversity Each Iterations</h3></div>
        <div> 
        <Line data={euclideanData}/>
        </div>
        <div><h3>Convergence Rate: <b>{convRate}</b></h3></div>
        <div><h3>Execution Time for WOA: <b>{timeElapsed}ms</b></h3></div>
        <div><h3>Constraint Violation: </h3></div>
        <Table bordered className='woa-table' style={{marginTop:'10px',width:"750px",margin:"auto",marginBottom:"10px", borderColor:"green"}}>
                <thead>
                    <tr className='table-success woa-table'>
                        <th className='woa-table' style={{textAlign:"center"}}>Number of Constraints Violated</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Penalty for Charging Station</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Penalty for Time Availability</th>  
                    </tr>
                </thead>         
                      <tbody>
                      <tr className='table-success woa-table'>
                              <td className='woa-table' style={{textAlign:"center"}}>{constraintsPenalties[0]}</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{constraintsPenalties[1]}</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{constraintsPenalties[2]}</td>

                     </tr>                                                
                  </tbody>
           </Table>
        </Modal>
        </div>
    );
};

export default Experiment;