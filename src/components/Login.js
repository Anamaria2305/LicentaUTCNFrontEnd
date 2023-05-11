import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const showToastMessage = () =>
        toast.error('Incorrect credentials !', {
            position: toast.POSITION.TOP_RIGHT
        });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                { username, password }
            );
            console.log(response.data)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
            navigate('/home');
        } catch (error) {
            console.log(error);
            showToastMessage();
        }
    };

    return (
        <div>
            <ToastContainer />
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
};

export default Login;