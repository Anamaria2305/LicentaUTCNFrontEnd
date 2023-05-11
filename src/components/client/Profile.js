import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState({});

    const username = localStorage.getItem('username')

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await axios.get(`http://localhost:8000/api/users/${username}`);
            console.log(data)
            setUser(data);
        };
        fetchUser();
    }, [username]);

    const handleUsernameChange = (e) => {
        function setUsername(value) {
            
        }

        setUsername(e.target.value);
    };


    return (
        <div>
            <ClientNav/>
            <div className="details">
                {/*<label><strong>Username: </strong>*/}
                {/*    <input type="text" value={username} onChange={handleUsernameChange} />*/}
                {/*</label>*/}
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
            </div>
        </div>
    );
};

export default Profile;