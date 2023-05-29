import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function SignupPage() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const showToastMessage = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });

    const showSuccessToastMessage = () =>
        toast.info('Signup Successful! You will be redirected to the login page', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const role = 'Client'
            const response = await axios.post(
                "http://localhost:8000/api/signup",
                {username, email, phone, password, role}
            );
            console.log(response.data)
            showSuccessToastMessage();
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.log(error.response.data.message)
            showToastMessage(error.response.data.message);
        }

        setUserName('');
        setEmail('');
        setPhone('');
        setPassword('');
    };

    return (
        <div>
            <ToastContainer />
            <form onSubmit={handleSignup}>

                <div>
                   <label htmlFor="userName">User Name:</label>
                   <input
                      type="text"
                      id="lastName"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                       type="email"
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupPage;
