import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import {toast, ToastContainer} from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const username = localStorage.getItem('username')

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await axios.get(`http://localhost:8000/api/users/${username}`);
            console.log(data)
            setUserName(data.username);
            setEmail(data.email);
            setPhone(data.phone);
            setPassword(data.password);
        };
        fetchUser();
    }, [username]);

    const showSuccessToastMessageEditUser = (message) =>
        toast.info(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const handleUserEdit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8000/api/users";
            const data = {username, email, phone, password, userName};
            await axios.put(url, data);
            localStorage.removeItem('username');
            localStorage.setItem('username', userName);
            showSuccessToastMessageEditUser('User data has been added successfully! Page will be reloaded');
            setTimeout(() => {
                window.location.reload()
            }, 3005);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.log(errorMessage);
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }


    return (
        <div>
            <ToastContainer />
            <ClientNav/>
            <p>Edit Your Profile Page</p>
            <form onSubmit={handleUserEdit}>
                <div>
                    <label htmlFor="userName">User Name: </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone Number: </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="button" onClick={toggleShowPassword}>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                </div>

                <button type="submit">Edit User</button>
            </form>
        </div>
    );
};

export default Profile;