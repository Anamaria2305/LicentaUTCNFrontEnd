import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import { Card, Classes } from "@blueprintjs/core";
import {toast, ToastContainer} from "react-toastify";
import "../../css/Login.css";
import axios from "axios";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
const Notifications = () => {

    const [station, setStation] = useState();
    const [time, setTime] = useState();
    const [data, setData] = useState();
    const [valueChr, setValueChr] = useState();
    const [isNotification,setIsNotification] = useState(false)
    const [location, setLocation] = useState([]);
    const locations = [
        { latitude:46.783268112023215,longitude: 23.62194039431511},
        { latitude:46.74841349371496, longitude:23.596804554098277},
        { latitude:46.776576313581614, longitude:23.60415708143363 },
        { latitude: 46.75977259501111, longitude:23.563878677375598 },
      ];
    const myemail = localStorage.getItem('email')
    useEffect(() => {
        axios.get(`http://localhost:8080/ev/notification?username=${myemail}`)
            .then((response) => {
                if(response.data.length>0){
                setIsNotification(true)
                setValueChr(response.data[0])
                setData(response.data[1])
                setStation(response.data[3].name)
                setTime(response.data[2])   
                setLocation([locations[response.data[3].id-1]])
                }            
            })
            .catch((error) => {
                showToastMessage('An error occurred');
            });
    }, []);
  
    const showToastMessage = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER
        });
    
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [showInfoWindow, setInfoWindowFlag] = useState(false);
    const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);

    const handleMarkerClick = (props, marker, location) => {
            setInfoWindowFlag(true);
            setSelectedElement(location);
            setSelectedMarkerPosition({ lat: location.latitude, lng: location.longitude });
        };
    
    const handleInfoWindowClose = () => {
            setInfoWindowFlag(false);
            setSelectedElement(null);
    };

    const containerStyle = {
        width: '820px',
        height: '350px'
    };
    
    const center = {
        lat: 46.7699,
        lng: 23.590
    };

    return (
        <div>
            <ClientNav/><div>
            <div className="custom-card">
            {isNotification && <Card className={Classes.ELEVATION_3}>
               <fieldset className="fieldset-bordered">
                   <div><pre>Your have been scheduled to charging station located on </pre>
                   <pre>{station}</pre>
                   <pre> tommorrow ({data}) at time {time}:00 with value {valueChr} KWh. </pre>
                   <pre>Check the map down below to find the location.</pre>
                   <pre>Have a nice day!</pre>
                   </div>
               </fieldset>
            </Card>}
            {!isNotification && <Card className={Classes.ELEVATION_3}>
               <fieldset className="fieldset-bordered">
                   <div><pre>You have no notifications yet.</pre>
                   <pre>Have a nice day!</pre>
                   </div>
               </fieldset>
            </Card>}
            </div></div>
            <div style={{display:'flex',justifyContent:"center", alignItems: 'center',margin:'auto',marginTop:"280px",marginBottom:"10px"}}>
            <LoadScript googleMapsApiKey="AIzaSyALD8glYng1LfMqO-tQLhUpVcCQOc6sSfU">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12.5}
                >
                    {location.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={locations[index]?.name}
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
                            {station}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            </div>
        </div>
    );
};

export default Notifications;