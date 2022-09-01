import React from "react";
import { ReactDOM } from "react";

export default function Modal(props) {
    return <div id="overlay" style={{display: props.isTenzies ? "block" : "none"}}>
                <div id="modal">
                    <h2>🎉Tenzies! You made it!</h2>
                    <p>Your time is {props.time} with {props.rolls} rolls!</p>
                    {/* <p>Best Time: 0:49</p>
                    <p>Best # of Rolls: {props.bestRolls}</p> */}
                    <button onClick={props.restartGame} id="close-modal">🔁 Play Again</button>
                </div>
            </div>
}