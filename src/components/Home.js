import AdminNav from "../navbars/AdminNav";
import React from "react";
import ClientNav from "../navbars/ClientNav";

const Home = () => {

    const role = localStorage.getItem("role");
    return (
        <div>
            {role === 'Admin' ? <AdminNav/> : <ClientNav/>}
            <h1>Welcome to my website!</h1>
            <p>This is the homepage of my website.</p>
        </div>
    );
};

export default Home;