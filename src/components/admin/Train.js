import AdminNav from "../../navbars/AdminNav";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../../css/Login.css";
import { useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import { Modal } from 'react-responsive-modal';
import axios from "axios";
import {Line} from "react-chartjs-2";

const Train = () => {

    const [cars, setCars] = useState();
    const [hours, setHours] = useState();
    const [cs, setCS] = useState();
    const [episodes, setEpisodes] = useState();
    const [disbl, setDis] = useState(false);
    const [learningRate, setLearningRate] = useState();
    const [epsilonDecay, setEpsilonDecay] = useState();
    const [batchSize, setBatchSize] = useState();
    const [memoryLength, setMemoryLength] = useState();
    const [discountFactor, setDiscountFactor] = useState();
    const [selectedOption, setSelectedOption] = useState('Charge');
    const [selectedLineInterval, setSelectedLineInterval] = useState();
    const [averageRewards, setAverageRewards] = useState('');


    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);


    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const onChangeCars = (e) => {
        setCars(e.target.value)
        const nr = e.target.value;
        if(nr > cs * hours || nr <=0){
            setDis(true)
        }
        else
        {
            setDis(false)
        }
    }

    const onChangeCS = (e) => {
        setCS(e.target.value)
        if(cars > e.target.value * hours || e.target.value <=0){
            setDis(true)
        }
        else
        {
            setDis(false)
        }
    }

    const onChangeHours = (e) => {
        setHours(e.target.value)
        if(cars > cs * e.target.value || e.target.value <=0){
            setDis(true)
        }
        else
        {
            setDis(false)
        }
    }

    const onChangeEpisodes = (e) => {
        setEpisodes(e.target.value)
        const inputValue = parseInt(e.target.value);
        if (inputValue <= 0) {
            setEpisodes(1)
        }
    }

    const onChangeLearningRate = (e) => {
        setLearningRate(e.target.value)
        const inputValue = parseFloat(e.target.value);
         if (inputValue < 0) {
             setLearningRate(0.001)
         }
    }

    const onChangeEpsilonDecay = (e) => {
        setEpsilonDecay(e.target.value)
        const inputValue = parseFloat(e.target.value);
        if (inputValue <= 0) {
            setEpsilonDecay(0)
        }
    }

    const onChangeDiscountFactor = (e) => {
        setDiscountFactor(e.target.value)
        const inputValue = parseFloat(e.target.value);
        if (inputValue <= 0) {
            setDiscountFactor(0)
        }
    }

    const onChangeBatchSize = (e) => {
        setBatchSize(e.target.value)
        const inputValue = parseInt(e.target.value);
        if (inputValue <= 0) {
            setBatchSize(0)
        }
    }

    const onChangeMemoryLength = (e) => {
        setMemoryLength(e.target.value)
        const inputValue = parseInt(e.target.value);
        if (inputValue <= 0) {
            setMemoryLength(0)
        }
    }

    const LINEdata = {
        labels: selectedLineInterval,
        datasets: [
            {
                label: "Average Reward per 100 Episodes",
                data: averageRewards,
                backgroundColor: ["blue"],
                borderColor: ["blue"],
                borderWidth: 0.5,
                fill: false,
                tension: 0.4
            },
        ],
    };

    const handleTraining = async (e) => {
        e.preventDefault()
        console.log(cs)
        console.log(hours)
        console.log(cars)
        console.log(episodes)
        console.log(learningRate)
        console.log(epsilonDecay)
        console.log(discountFactor)
        console.log(batchSize)
        console.log(memoryLength)
        console.log(selectedOption)

        try {
            const response = await axios.post(
                "http://localhost:8000/api/train",
                {cs, hours, cars, episodes, learningRate, epsilonDecay, discountFactor, batchSize, memoryLength, selectedOption}
            );
            console.log(response.data)
            console.log(response.data.average_rewards.length)

            let myLineInterval = []

            for(let i=100;i<=episodes;i=i+100){
                myLineInterval.push(i)
            }

            console.log(myLineInterval)
            setSelectedLineInterval(myLineInterval)
            setAverageRewards(response.data.average_rewards)

        } catch (error) {
            console.log(error);
        }

        onOpenModal()

    };

    return (
        <div className="loginpage">
            <AdminNav/>
            <div className="car-form">
                <ToastContainer />
                <Card className={Classes.ELEVATION_3}>
                    <Form onSubmit={handleTraining}>
                        <fieldset className="fieldset-bordered">
                            <Form.Label>
                                <legend>Train Model</legend>
                            </Form.Label>

                            <Form.Group>
                                <Form.Label>Number of Charging Stations: </Form.Label>
                                <Form.Control
                                    type="number"
                                    aria-label="Default select example"
                                    value = {cs}
                                    required
                                    name="ncs"
                                    style={{ width: "100%" }}
                                    placeholder= "Number of Charging Stations"
                                    onChange={(e) => {onChangeCS(e)}}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label> Scheduling Window: </Form.Label>
                                <Form.Control
                                    type="number"
                                    aria-label="Default select example"
                                    value = {hours}
                                    required
                                    style={{ width: "100%" }}
                                    placeholder= "Scheduling Window"
                                    onChange={(e) => {onChangeHours(e)}}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Number of Electric Vehicles:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="cars"
                                    value = {cars}
                                    onChange={(e) => onChangeCars(e)}
                                    placeholder="Electric Vehicles"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Number Episodes:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="episode"
                                    value = {episodes}
                                    onChange={(e) => onChangeEpisodes(e)}
                                    placeholder="Episodes"
                                />
                            </Form.Group>

                            <Form.Label><legend>Hyper Parameters</legend></Form.Label>

                            <Form.Group>
                                <Form.Label>Learning Rate:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="learningRate"
                                    value = {learningRate}
                                    onChange={(e) => onChangeLearningRate(e)}
                                    placeholder="Learning Rate"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Epsilon Decay:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="epsilonDecay"
                                    value = {epsilonDecay}
                                    onChange={(e) => onChangeEpsilonDecay(e)}
                                    placeholder="Epsilon Decay"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Discount Factor:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="discount factor"
                                    value = {discountFactor}
                                    onChange={(e) => onChangeDiscountFactor(e)}
                                    placeholder="Discount Factor"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Batch Size:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    step = "any"
                                    name="batchSize"
                                    value = {batchSize}
                                    onChange={(e) => onChangeBatchSize(e)}
                                    placeholder="Batch Size"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Memory Length:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    name="memoryLength"
                                    value = {memoryLength}
                                    onChange={(e) => onChangeMemoryLength(e)}
                                    placeholder="Memory Length"
                                />
                            </Form.Group>


                            <Form.Group style={{marginTop:"5px"}}>
                                <Form.Label> Choose energy curve: </Form.Label>
                                <div>
                                    <Form.Check type="radio" inline value="Charge" label="Charge" name="radioGroup" defaultChecked onChange={handleRadioChange}/>
                                    <Form.Check type="radio" inline value="Discharge" label="Discharge" name="radioGroup" onChange={handleRadioChange}/>
                                </div>
                            </Form.Group>

                            <Button className="but" variant="primary" disabled={disbl} type="submit" style={{ margin: "10px" }}>
                                Train Model
                            </Button>
                        </fieldset>
                    </Form>
                </Card>
            </div>

            <Modal open={open} onClose={onCloseModal} center>
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
            </Modal>
        </div>
    );

};

export default Train;