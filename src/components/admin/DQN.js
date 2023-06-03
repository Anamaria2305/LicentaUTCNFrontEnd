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

ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);

const containerStyle = {
    width: '600px',
    height: '600px'
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

        const LINEdata = {
            labels: ["13:00", "14:00", "15:00"],
            datasets: [
                {

                    label: "Energy Differences(KW)",
                    data: energyDifferences,
                    backgroundColor: ["green"],
                    borderColor: ["green"],
                    borderWidth: 0.5,

                    // label: 'Dataset 1',
                    // data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    // borderColor: 'red',
                    tension: 0.4,
                },
                {
                    label: "Energy Differences New(KW)",
                    data: energyDifferencesAfter,
                    backgroundColor: ["red"],
                    borderColor: ["red"],
                    borderWidth: 0.5,

                    // label: 'Dataset 1',
                    // data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    // borderColor: 'red',
                    tension: 0.4,
                },
            ],
        };

    const handleChargeOrDischarge = (event) => {
        setChargeOrDischarge(event.target.value);
    };

    useEffect(() => {

        const fetchEnergyDifferences = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/energy_differences`);
                console.log(response.data)
                setEnergyDifferences(response.data);
                const sum = response.data.reduce((acc, curr) => acc + curr, 0);
                console.log(sum)
                sum > 0 ? setChargeOrDischarge("charge") : setChargeOrDischarge("discharge")
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchEnergyDifferences();


        const fetchChargingStationsDifferences = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/charging_stations`);
                console.log(response.data)
                setLocations(response.data);
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        fetchChargingStationsDifferences();
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

    async function makePrediction() {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/prediction",
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
            //setEnergyDifferences(response.data.energy_diff)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Make Prediction</h1>
            <p><strong>Number Electric Vehicles: </strong> </p>
            <p><strong>Number Charging Stations: </strong> </p>
            <FormLabel id="charge-discharge-buttons">Choose Charge/Discharge:</FormLabel>
            <RadioGroup
                row
                aria-labelledby="controlled-charge-discharge-radio-group"
                name="charge-discharge-radio-group"
                value={chargeOrDischarge}
                onChange={handleChargeOrDischarge}
            >
                <FormControlLabel value="charge" control={<Radio />} label="Charge" />
                <FormControlLabel value="discharge" control={<Radio />} label="Discharge" />
            </RadioGroup>
            <Button variant='info'
            onClick={makePrediction}>
            Make scheduling
            </Button>
            <div>
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
                <Line data={LINEdata}/>
            </div>
            <Button type='submit' variant='info' style={{margin:"10px"}}>
            Finalize
            </Button>

            <LoadScript googleMapsApiKey="AIzaSyALD8glYng1LfMqO-tQLhUpVcCQOc6sSfU">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13.5}
                >
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={location.name}
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
    );

}

export default DQN;
