import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button,Table} from "react-bootstrap";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
import './Scheduler.css';

const WOA = () => {

    const [schedule,setSchedule] = useState([])
    const [oldediff,setoldediff] = useState([])
    const [newediff,setnewediff] = useState([])
    const [carsCharge,setCarCharge] = useState([])
    const [carsChargeHours,setCarChargeHours] = useState([])
    const [cs,setCs] = useState([])
    const [ore,setore] = useState([])
    const [msjStatii,setmsjStatii] = useState([])
    const [correlation,setCorr] = useState()
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

    useEffect(() => {

        axios.get("http://localhost:8080/ev/ediff?plugs=3&startTime=8&chargeType=Charge")
        .then((response) => {
            let copieore = []
            setoldediff(response.data)
            for(let i=8;i<response.data.length+8;i++){
                copieore.push(i)
            }
            setore(copieore)
        })
        .catch(err => {
           
        })

    },[]);

    async function makePrediction() {
        axios.get("http://localhost:8080/ev/sol?timeSlots=3&startTime=8&chargeType=Charge&maxCars=24&sampleSize=50")
        .then(res => {
        setnewediff(res.data[0]);
        setCarCharge(res.data[1]);
        setSchedule(res.data[2][0])
        setCarChargeHours(res.data[3][0])
        setCs(res.data[4][0])
        setCorr(res.data[5][0])
        setmsjStatii(res.data[6][0])
        
    })
    .catch(err => {
       
    })
    }

    const containerStyle = {
        width: '600px',
        height: '600px'
    };
    
    const center = {
        lat: 46.7699,
        lng: 23.590
    };

    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [showInfoWindow, setInfoWindowFlag] = useState(false);
    const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);

    const handleMarkerClick = (props, marker, location,index) => {
        setSelectedIndex(index)
        setSelectedElement(location);
        setInfoWindowFlag(true);
        setSelectedMarkerPosition({ lat: location.latitude, lng: location.longitude });
    };

    const handleInfoWindowClose = () => {
        setInfoWindowFlag(false);
        setSelectedElement(null);
    };

    return (
        <div>
            <div style={{maxWidth:"50%",display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto'}}>
                <Line data={LINEdata}/> 
            </div>
            {correlation && <div style={{display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto',marginTop:"10px",marginBottom:"10px"}}>
            <h5>Correlation coefficient between the curves is: <b>{correlation}</b></h5>
            </div>}
            <div style={{display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto',marginTop:"10px",marginBottom:"10px"}}>
             <Button variant='info' 
            onClick={makePrediction}>
            Make scheduling
            </Button>   
            </div>         
            <div>
            <div style={{display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto',marginTop:"10px",marginBottom:"10px"}}>
            <LoadScript googleMapsApiKey="AIzaSyALD8glYng1LfMqO-tQLhUpVcCQOc6sSfU">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12.5}
                >
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={cs[index*2]?.name}
                            onClick={(props, marker) =>
                                handleMarkerClick(props, marker, location,index)
                            }
                        />
                    ))}
                    {selectedElement && (
                        <InfoWindow
                            visible={showInfoWindow}
                            position={selectedMarkerPosition}
                            onCloseClick={handleInfoWindowClose}
                            
                        >
                            <div style={{ minHeight: '50px',maxWidth:'21ł0px',wordWrap: 'break-word'}}>
                            {msjStatii[selectedIndex]}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            </div>
            <Table bordered className='woa-table' style={{marginTop:'10px',width:"750px",margin:"auto",marginBottom:"10px", borderColor:"green"}}>
                <thead>
                    <tr className='table-success woa-table'>
                        <th className='woa-table' style={{textAlign:"center"}}>Licence Plate</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Model of Car</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Amount To Be Charged</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Current SOC</th>  
                        <th className='woa-table' style={{textAlign:"center"}}>Target SOC</th>  
                        <th  className='woa-table' style={{textAlign:"center"}}>Scheduled Time for Arrival</th>
                        <th  className='woa-table' style={{textAlign:"center"}}>Location of Charging Station</th>
                    </tr>
                </thead>

                {schedule.map((car,index) => (
                      
                      <tbody>
                      <tr className='table-success woa-table'>
                              <td className='woa-table' style={{textAlign:"center"}}>{car?.electricVehicle?.plateNumber}</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{car?.electricVehicle?.model}</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{car?.valueCharged} (kW)</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{car?.electricVehicle?.soccurrent}%</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{Math.round(car?.electricVehicle?.soccurrent + (100*car?.valueCharged)/car?.electricVehicle?.maxCapacity)}%</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{carsChargeHours[index]+8}:00</td>
                              <td className='woa-table' style={{textAlign:"center"}}>{cs[index].id}-{cs[index].name}</td>
                     </tr>                                                
                  </tbody>
                  ))}
           </Table>
           </div>
        </div>
    );
};

export default WOA;