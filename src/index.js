import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Experiment from './components/admin/Experiment';
import Scheduler from './components/admin/Scheduler';
import Car from './components/client/Car';
import Profile from './components/client/Profile';
import Notifications from './components/client/Notifications';
import Home from "./components/Home";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/experiment' element={<Experiment/>}/>
            <Route path='/schedule' element={<Scheduler/>}/>
            <Route path='/car' element={<Car/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
            {/*<Route path='/provider' element={<ProviderView/>}/>*/}
            {/*<Route path='/problemDetails' element={<ProblemDetails/>}/>*/}
            {/*<Route path='/providerDetails' element={<ProviderDetails/>}/>*/}
            {/*<Route path='/chats' element={<ChatsView/>}/>*/}
            {/*<Route path='/chat' element={<ChatView/>}/>*/}
            {/*<Route path='/providerProfiles' element={<ProviderProfilesView/>}/>*/}
            {/*<Route path='/providerProfile' element={<ProviderProfile/>}/>*/}
            {/*<Route path='/beneficiaryProfile' element={<Profile/>}/>*/}
            {/*<Route path='/makeAnOffer' element={<MakeAnOffer/>}/>*/}
            {/*<Route path='/postProblem' element={<PostProblemView/>}/>*/}
            {/*<Route path='/beneficiary' element={<BeneficiaryHome/>}/>*/}
            {/*<Route path='/offers' element={<Offers/>}/>*/}
            {/*<Route path='/favourites' element={<Favourites/>}/>*/}
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
