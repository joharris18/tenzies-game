import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useStopwatch } from "react-timer-hook"
import Modal from "./Modal"
import './App.css'

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [isGameRunning, setIsGameRunning] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const {seconds, minutes, start, pause, reset} = useStopwatch({})
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            pause()
        }
    }, [dice])


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if(!tenzies && !isGameRunning) {
            
            start()
            setIsGameRunning(true)
            setRollCount(prevRoll => prevRoll + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else if(!tenzies && isGameRunning) {
            setRollCount(prevRoll => prevRoll + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            
        } 
         else {
            document.querySelector("#overlay").style.display = "block"
        }
    }
    
    function holdDice(id) {
        if(!tenzies && !isGameRunning) {
            start()
            setIsGameRunning(true)
        }
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function restartGame() {
        setTenzies(false)
        setDice(allNewDice())
        setRollCount(0)
        setIsGameRunning(false)
        reset()
        document.querySelector("#overlay").style.display = "none"
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti width={window.innerWidth} />}
            <Modal 
                isTenzies={tenzies} 
                restartGame={restartGame}
                time={`${minutes} min and ${seconds} secs`}
                rolls={rollCount}
            />
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.
            <br/>
            <br/>
            click any die or the "roll" button to start !</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="timer-container"> 
                <p className="timer"><strong>Time</strong> {`min: ${minutes} sec: ${seconds}`}</p>
                <p className="roll-count">Rolls: {rollCount}</p>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}