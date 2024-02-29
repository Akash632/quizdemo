import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const questions = [
    {
      id:1,
      question : 'What is your name?',
      options : [
        {option : "a", answer : "Akash"},
        {option : "b", answer : "Ashok"},
        {option : "c", answer : "Madhav"},
        {option : "d", answer : "None of the above"}
      ],
      correct_answer : "a"
    },
    { 
      id:2,
      question : 'What is your age?',
      options : [
        {option : "a", answer : "18"},
        {option : "b", answer : "19"},
        {option : "c", answer : "20"},
        {option : "d", answer : "None of the above"}
      ],
      correct_answer : "c"
    },
    { 
      id:3,
      question : 'What is your gender?',
      options : [
        {option : "a", answer : "Female"},
        {option : "b", answer : "Male"},
        {option : "c", answer : "Don't want to disclose"},
        {option : "d", answer : "None of the above"}
      ],
      correct_answer : "b"
    }
  ]


  const [index, setIndex] = useState(0);
  const [present, setPresent] = useState(questions[index]);
  const [score, setScore] = useState(0);
  const [finished , setFinished] = useState(false);

;
  const handleSelect = (option)=>{
    console.log(index)
    if(option === present.correct_answer && index < questions.length){
      if(index === questions.length -1 ){
        setFinished(true);
      }else{
        setScore(score+1);
        setIndex(index+1);
        setPresent(questions[index+1]);
      }
    }else{
      setIndex(index+1);
      setPresent(questions[index+1]);
      setScore(score-1);
    }
  }
  return (
    <div className="App">
      {finished?(
        <div>
          <h1>Quiz ended</h1>
          <h3>Your total score : {score}</h3>
          </div>
      ):index<=questions.length - 1 && (
        <div>
          <h1>Score : {score}</h1>
          <h3>Question : {index+1}/{questions.length}</h3>
          <h1>{present.question}</h1>
          {present.options.map(({option,answer})=>(
            <button value={option} onClick={(e)=>handleSelect(e.target.value)}>{answer}</button>
          ))}
        </div>
      )}
      </div>
  );
}

export default App;
