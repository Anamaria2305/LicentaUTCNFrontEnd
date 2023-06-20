// import { Bar } from "react-chartjs-2";
import { Line } from 'react-chartjs-2';
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Button} from "react-bootstrap";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from "@mui/material/FormLabel";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
import myMarkerIcon from './myMarkerIcon.png';

ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);

const containerStyle = {
    width: '700px',
    height: '500px'
};

const center = {
    lat: 46.7699,
    lng: 23.590
};


function DQN() {

    const [energyDifferences, setEnergyDifferences] = useState('');
    const [energyDifferencesAfter, setEnergyDifferencesAfter] = useState('');
    const [chargeOrDischarge, setChargeOrDischarge] = useState('');
    const [selectedElement, setSelectedElement] = useState(null);
    const [showInfoWindow, setInfoWindowFlag] = useState(false);
    const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);
    const [locations, setLocations] = useState([]);
    const [numElectricVehicles, setNumElectricVehicles] = useState(0);
    const [numChargingStations, setNumChargingStations] = useState(0);
    const [seeFinalize, setSeeFinalize] = useState(false);
    const [selectedInterval, setSelectedInterval] = useState('12:00-16:00');
    const [selectedLineInterval, setSelectedLineInterval] = useState(["12:00", "13:00", "14:00", "15:00", "16:00"]);


    const parseTimeIntervals = (intervalString) => {
        const [startTime, endTime] = intervalString.split('-');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const timestamps = [];

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = startMinute; minute <= endMinute; minute += 60) {
                const timestamp = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timestamps.push(timestamp);
            }
        }

        return timestamps;
    };

    const handleIntervalChange = (event) => {
        let selectedLineInterval = parseTimeIntervals(event.target.value);
        setSelectedLineInterval(selectedLineInterval);
        setSelectedInterval(event.target.value);
        const fetchEnergyDifferences = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/energy_differences`, {selectedLineInterval});
                setEnergyDifferences(response.data);
                const sum = response.data.reduce((acc, curr) => acc + curr, 0);
                console.log(sum)
                sum > 0 ? setChargeOrDischarge("charge") : setChargeOrDischarge("discharge")
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchEnergyDifferences();
    };

    const LINEdata = {
        labels: selectedLineInterval,
        datasets: [
            {
                label: "Energy Differences(KW)",
                data: energyDifferences,
                backgroundColor: ["green"],
                borderColor: ["green"],
                borderWidth: 0.5,
                fill: false,
                tension: 0.4
            },
            {
                label: "Energy Differences New(KW)",
                data: energyDifferencesAfter,
                backgroundColor: ["red"],
                borderColor: ["red"],
                borderWidth: 0.5,
                fill: false,
                tension: 0.4
            },
        ],
    };

    const handleChargeOrDischarge = (event) => {
        setChargeOrDischarge(event.target.value);
    };


    useEffect(() => {

        const fetchEnergyDifferences = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/energy_differences`, {selectedLineInterval});
                setEnergyDifferences(response.data);
                const sum = response.data.reduce((acc, curr) => acc + curr, 0);
                console.log(sum)
                sum > 0 ? setChargeOrDischarge("Charge") : setChargeOrDischarge("Discharge")
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchEnergyDifferences();

        const fetchChargingStationsLocations = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/charging_stations`);
                setLocations(response.data);
                setNumChargingStations(response.data.length)
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchChargingStationsLocations();


        const fetchNumberElectricVehicles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/vehicle_size`);
                setNumElectricVehicles(response.data.number)
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchNumberElectricVehicles();

    }, []);


    const handleMarkerClick = (props, marker, location) => {
        setSelectedElement(location);
        setInfoWindowFlag(true);
        setSelectedMarkerPosition({ lat: location.latitude, lng: location.longitude });
    };

    const handleInfoWindowClose = () => {
        setInfoWindowFlag(false);
        setSelectedElement(null);
    };

    const shouldShowIcon = (location) => {
        if(location.name.includes('\n'))
            return true
    };

    async function makePrediction() {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/prediction",
                {selectedLineInterval, chargeOrDischarge}
            );
            console.log(response.data.message_list)
            const modifiedLocations = locations.map((location, index) => {
                return {
                    ...location,
                    name: response.data.message_list[index]
                };
            });
            setLocations(modifiedLocations);
            setEnergyDifferencesAfter(response.data.energy_diff)
            setSeeFinalize(true)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div style={{marginLeft: "50px"}}>
            <h1>Schedule Vehicles</h1>
            <br />

            <div>
                <FormLabel style={{marginBottom: '5px', color: 'black'}}>Number Electric Vehicles: {numElectricVehicles} </FormLabel>
                <br />
                <FormLabel style={{marginBottom: '5px', color: 'black'}}>Number Charging Stations: {numChargingStations}</FormLabel>
                <br />
                <FormLabel style={{marginBottom: '5px', color: 'black'}}>Electric Vehicles will be scheduled for: {chargeOrDischarge}</FormLabel>
            </div>

            {/*<div style={{ display: 'flex', alignItems: 'center', paddingBottom: "18px" }}>*/}
            {/*    <FormLabel id="charge-discharge-buttons" style={{paddingRight:"20px", color: 'black'}}>Choose Charge/Discharge:</FormLabel>*/}
            {/*    <RadioGroup*/}
            {/*        row*/}
            {/*        aria-labelledby="controlled-charge-discharge-radio-group"*/}
            {/*        name="charge-discharge-radio-group"*/}
            {/*        value={chargeOrDischarge}*/}
            {/*        onChange={handleChargeOrDischarge}*/}
            {/*    >*/}
            {/*        <FormControlLabel value="charge" control={<Radio />} label="Charge" />*/}
            {/*        <FormControlLabel value="discharge" control={<Radio />} label="Discharge" />*/}
            {/*    </RadioGroup>*/}
            {/*</div>*/}

            <div>
                <FormLabel htmlFor="interval" style={{paddingRight: "10px", color: 'black' }}>Choose a time interval:</FormLabel>
                <select id="interval" value={selectedInterval} onChange={handleIntervalChange}>
                    <option value="11:00-15:00">11:00-15:00</option>
                    <option value="12:00-16:00">12:00-16:00</option>
                    <option value="13:00-17:00">13:00-17:00</option>
                </select>
            </div>

            <div style={{width: "600px", paddingTop: "18px"}}>
                <Line
                    data={LINEdata}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            </div>

            <Button variant='info'
                    onClick={makePrediction}>
                Schedule Vehicles
            </Button>

            {seeFinalize && (
                <Button type='submit' variant='info' style={{margin:"10px"}}>
                    Finalize
                </Button>
            )}

            <div style={{ position: 'absolute', top: 150, right: 120 }}>
                <LoadScript googleMapsApiKey="AIzaSyALD8glYng1LfMqO-tQLhUpVcCQOc6sSfU">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13.2}
                    >
                        {locations.map((location, index) => (
                            <Marker
                                key={index}
                                position={{ lat: location.latitude, lng: location.longitude }}
                                title={location.name}
                                icon={shouldShowIcon(location)
                                    ? {
                                        url: myMarkerIcon,
                                        scaledSize: new window.google.maps.Size(33, 46),
                                    }
                                    : undefined}
                                onClick={(props, marker) =>
                                    handleMarkerClick(props, marker, location)
                                }
                            />
                        ))}
                        {selectedElement && (
                            <InfoWindow
                                visible={showInfoWindow}
                                position={selectedMarkerPosition}
                                onCloseClick={handleInfoWindowClose}
                            >
                                <div>
                                    <p style={{ whiteSpace: 'pre' }}>{selectedElement.name}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );

}

export default DQN;


{/*<Bar*/}
{/*    data={{*/}
{/*        labels: ["13:00", "14:00", "15:00"],*/}
{/*        datasets: [*/}
{/*            {*/}
{/*                label: "Energy Differences(KW)",*/}
{/*                data: energyDifferences,*/}
{/*                backgroundColor: ["green"],*/}
{/*                borderColor: ["green"],*/}
{/*                borderWidth: 0.5,*/}
{/*            },*/}
{/*        ],*/}
{/*    }}*/}
{/*    height={400}*/}
{/*    options={{*/}
{/*        maintainAspectRatio: false,*/}
{/*        scales: { yAxes: [{ ticks: { beginAtZero: true } }] },*/}
{/*    }}*/}
{/*    type={Bar}*/}
{/*/>*/}