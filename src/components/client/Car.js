import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../../css/Login.css";
import PreferenceOrder from "./PreferenceOrder";
const Car = () => {

    const [identification, setIdentification] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [battery_capacity, setBatteryCapacity] = useState('');
    const [isNew, setIsNew] = useState(true);
    const [charginStationArray, setcharginStationArray] = useState([]);

    const myemail = localStorage.getItem('email')

    const [errorMessage, setMessage] = useState("");
    const [disbl, setDis] = useState(false);
    const [ore,setOre] = useState([8,9,10,11,12,13,14,15,16,17])
    const [checkedItems, setCheckedItems] = useState([]);
    const [values,setValues] = useState(["Favourite Charging Station","Time Interval"]);

    const [isCI, setIsCI] = useState(true);
    const [isBrand, setIsBrand] = useState(true);

    const onChangeCI = (e) => {
        setIdentification(e.target.value)
        var nr = e.target.value
        let nrREG = new RegExp("^(?:[A-Z]{1,2}\\d{2}(?:\\d{1})?[A-Z]{3})$");
        if(!nrREG.test(nr)){
         setIsCI(false)
         setDis(true)
        }
        else
        {
        setIsCI(true)
        setDis(false)
        }
      }

      const onChangeBrand = (e) => {
        setBrand(e.target.value)
        var pass = e.target.value
        let nrREG = new RegExp('^.{3,15}$')
        if(!nrREG.test(pass)){
         setIsBrand(false)
         setDis(true)
        }
        else
        {
        setIsBrand(true)
        setDis(false)
        }
    }

    const onChangeBatteryCapacity = (e) => {
        e.target.value < 0
            ? (e.target.value = 0)
            : e.target.value = Math.round(e.target.value)
        setBatteryCapacity(e.target.value)
    }

    const onChangeModel = (e) => {
        setModel(e.target.value)
    }

    useEffect(() => {
        const fetchElectricVehicle = async () => {
            let csData
            try {
                const {data} = await axios.get(`http://localhost:8000/api/electric_vehicle/${myemail}`);
                setcharginStationArray(data)
            } catch (error){
                try {
                    csData = await axios.get(`http://localhost:8080/ev/allcs`);
                    setcharginStationArray(csData.data)
                } catch (error){
                    
                }
            }
            try {
                const {data} = await axios.get(`http://localhost:8000/api/electric_vehicle/${myemail}`);
                setIsNew(false)
                setIdentification(data.identification);
                setBrand(data.brand);
                setModel(data.model);
                setBatteryCapacity(data.battery_capacity);
            } catch (error){
                try {
                    const {data} = await axios.get(`http://localhost:8080/crud/evdriver?username=${myemail}`);
                    setIsNew(false)
                    setIdentification(data.plateNumber);
                    const model = data.model;
                    const options = model.split(' ');
                    setBrand(options[0]);
                    setModel(options[1]);
                    setBatteryCapacity(data.maxCapacity);
                    if(data.constraintsPenalty[0] < data.constraintsPenalty[1]){
                        setValues(["Time Interval","Favourite Charging Station"])
                    }
                    let incrementedTimeSlots = data.favouriteTimeSlots.map((timeSlot) => timeSlot + 7);
                    setCheckedItems(incrementedTimeSlots)
                    const initialSelectedStation = csData.data.filter(station => station.id == data.favouriteChargingStation.id)
                    setSelectedStation(initialSelectedStation[0].id);
                } catch (error){
                    setIsNew(true)
                }
            }
        };
        fetchElectricVehicle();
    }, []);

    const showToastMessage = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER
        });

    const showSuccessToastMessageCar = (message) =>
        toast.success(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });
    
    const handlePreferenceChange = (updatedValues) => {
            setValues(updatedValues);
          };

    const handleElectricVehicleOperation = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8000/api/electric_vehicle";
            const data = { identification, brand, model, battery_capacity, myemail };

            if (isNew) {
                await axios.post(url, data);
                showSuccessToastMessageCar('Your car has been added successfully! Page will be reloaded');
                setIsNew(false);
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            } else {
                await axios.put(url, data);
                showSuccessToastMessageCar('Your car has been edited successfully! Page will be reloaded');
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            }
        } catch (error) {
            try {
                var url
                if (isNew){
                    //added
                    url = `http://localhost:8080/crud/saveev?username=${myemail}`;
                }else{
                    //edited
                    url = `http://localhost:8080/crud/editev?username=${myemail}`;
                }

                let preference
                if(values[0]=='Favourite Charging Station'){
                    preference = [5,3]
                } else {
                    preference = [3,5]
                }
                const favTimSlots =  Array.from(checkedItems).map((timeSlot) => timeSlot - 7);
                const favCS = charginStationArray.filter(station => station.id == selectedStation)  
                const data = { plateNumber: identification, model:brand+" "+ model, maxCapacity: battery_capacity,
                            constraintsPenalty:preference,
                            favouriteTimeSlots :favTimSlots,
                            favouriteChargingStation: favCS[0]
                 };
                 const min = 15;
                 const max = 45;
                 const dataForSave = { plateNumber: identification, model:brand+" "+ model, 
                 maxCapacity: battery_capacity,
                 constraintsPenalty:preference,
                 favouriteTimeSlots :favTimSlots,
                 favouriteChargingStation: favCS[0],
                 minSOC:20,
                 soccurrent: Math.floor(Math.random() * (max - min + 1)) + min,
                 chrDisPerHour: 18
                    };
                if (isNew) {
                    await axios.post(url, dataForSave);
                    showSuccessToastMessageCar('Your car has been added successfully! Page will be reloaded');
                    setIsNew(false);
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);
                } else {
                    await axios.post(url, data);
                    showSuccessToastMessageCar('Your car has been edited successfully! Page will be reloaded');
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);
                }  
            } catch (error) {
                showToastMessage('An error occurred');
            }
        }
    };

    const handleCheckboxChange = (event) => {
        const value = parseInt(event.target.value);
        const newCheckedItems = new Set(checkedItems); // Create a new Set based on existing checkedItems
      
        if (newCheckedItems.has(value)) {
          newCheckedItems.delete(value);
        } else {
          newCheckedItems.add(value);
        }
      
        if (newCheckedItems.size === 0) {
          newCheckedItems.add(value);
        }
      
        setCheckedItems(newCheckedItems);
      };


      const [selectedStation, setSelectedStation] = useState('');
      const handleSelectChange = (event) => {
        setSelectedStation(event.target.value);
      };

    return (
        <div className="loginpage">
        <ClientNav/>
        <div className="car-form">
       <ToastContainer />
       <Card className={Classes.ELEVATION_3}>
           <Form onSubmit={handleElectricVehicleOperation}>
               <fieldset className="fieldset-bordered">
                   <Form.Label>
                   {isNew === true && <legend>Add Your Electric Vehicle Data</legend>}
                   {isNew !== true && <legend>Edit Your Electric Vehicle</legend>}
                   </Form.Label>
                   <Form.Group>
                       <Form.Label className ={isCI ? "Car identification" : "error-msg"}  >{isCI ? "Car identification" : "Invalid Format"} </Form.Label>
                       <Form.Control type="text" required name="carid"
                            value={identification}
                           placeholder="Car identification" onChange={(e) => onChangeCI(e)}
                           className ={isCI ? "Car identification" : "error-box"}/>
                   </Form.Group>
                   <div style={{display:"flex",gap:"50px"}}>
                   <Form.Group style={{width:"100%"}}>
                       <Form.Label className ={isBrand ? "Car identification" : "error-msg"}>{isBrand ? "Brand" : "Invalid Format"}</Form.Label>
                       <Form.Control type="text" required name="brand" 
                           value={brand}
                           placeholder="Brand" onChange={(e) => onChangeBrand(e)}
                           className ={isBrand ? "Car identification" : "error-box"} />
                   </Form.Group>
                   <Form.Group style={{width:"100%"}}>
                       <Form.Label>Model:</Form.Label>
                       <Form.Control
                           type="text"
                           required name="model"
                           placeholder="Model"
                           onChange={(e) => onChangeModel(e)}
                           value={model} />
                   </Form.Group>
                                       
                   </div>
                   <Form.Group>
                       <Form.Label>Battery capacity(kW):</Form.Label>
                       <Form.Control type="number" required name="maxcap"  onChange={(e) => onChangeBatteryCapacity(e)}
                            value={battery_capacity}
                           placeholder="Battery capacity" />
                   </Form.Group>
                   <Form.Group>
                    <Form.Label>Favourite Charging Station:</Form.Label>
                    <Form.Select aria-label="Default select example" name= "fcs" style={{ width: "100%" }}
                     onChange={handleSelectChange}
                     value={selectedStation}
                   >
                    { charginStationArray.map((charginStation) => (
                                   <option value={[charginStation.id]}>{charginStation.name}</option>
                               ))
                    }
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                       <Form.Label>Your availability:</Form.Label>
                       <div style={{display:"flex",justifyContent:"space-between",width: "100%"}}
                       value={selectedStation}
                       onChange={handleSelectChange}>
                       {ore.map((element) => (
                        <Form.Check
                        key={element}
                        type="checkbox"
                        id={`checkbox-${element}`}
                        label={element}
                        value={element}
                        checked={Array.from(checkedItems).includes(element)}
                        onChange={handleCheckboxChange}
                        />
                        ))}</div>
                   </Form.Group>
                   <div>
                    <Form.Label>Set Preference Order:</Form.Label>
                    <PreferenceOrder onPreferenceChange={handlePreferenceChange} values={values} />
                    </div>
                   <Form.Group style={{display:"flex",flexDirection:"column"}}>
                   <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage}</Form.Label>
                   </Form.Group>
                   <Button className="but" variant="warning" disabled={disbl} type="submit" style={{ margin: "10px" }}>
                      {isNew ? "Add car" : "Edit car"}
                   </Button>
               </fieldset>
           </Form>
       </Card>
   </div>
</div>
    );
};

export default Car;