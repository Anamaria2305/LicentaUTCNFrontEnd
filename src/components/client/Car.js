import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";

const Car = () => {

    const [identification, setIdentification] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [battery_capacity, setBatteryCapacity] = useState('');
    const [isNew, setIsNew] = useState(true);

    const username = localStorage.getItem('username')

    useEffect(() => {

        const fetchElectricVehicle = async () => {
            try {
                const {data} = await axios.get(`http://localhost:8000/api/electric_vehicle/${username}`);
                console.log(data)
                setIsNew(false)

                setIdentification(data.identification);
                setBrand(data.brand);
                setModel(data.model);
                setBatteryCapacity(data.battery_capacity);
            } catch (error){
                console.log(error.response.data.message)
                setIsNew(true)
                console.log(isNew)
            }
        };
        fetchElectricVehicle();
    }, []);

    const showToastMessage = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
        });

    const showSuccessToastMessageCar = (message) =>
        toast.info(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const handleElectricVehicleOperation = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8000/api/electric_vehicle";
            const data = { identification, brand, model, battery_capacity, username };

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
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.log(errorMessage);
            showToastMessage(errorMessage);
        }
    };

    return (
        <div>
            <ToastContainer />
            <ClientNav/>
            {isNew === true && (<p>Add Your Electric Vehicle Data</p>)}
            {isNew !== true && (<p>Edit Your Electric Vehicle</p>)}
            <form onSubmit={handleElectricVehicleOperation}>
                <div>
                    <label htmlFor="identification">Car Identification: </label>
                    <input
                        type="text"
                        id="identification"
                        value={identification}
                        onChange={(e) => setIdentification(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="brand">Brand: </label>
                    <input
                        type="text"
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="model">Model: </label>
                    <input
                        type="text"
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="battery_capacity">Battery Capacity: </label>
                    <input
                        type="number"
                        id="battery_capacity"
                        value={battery_capacity}
                        onChange={(e) => setBatteryCapacity(e.target.value)}
                        required
                    />
                </div>

                {isNew === true && (<button type="submit">Add Electric Vehicle</button>)}
                {isNew !== true && (<button type="submit">Edit Data</button>)}
            </form>
        </div>
    );
};

export default Car;