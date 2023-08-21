import React from "react";
import './styles/Question.css';
import  { useState, useEffect } from "react";

//Recibimos la pregunta, las opciones y un metodo para almacenar 
//Recibimos si la pregunta fue correcta
const Question = ({ question, options, handleOptionSelect, questionCheck, correct}) => {

  const [disable, setDisable] = useState(false);
  const [controlCorrect, setControlCorrect] = useState(false);

  useEffect(() => {
    setDisable(false);
    setControlCorrect(false);
  }, [question]);

  const handleButtonClick = (option) => {
    setDisable(true); // Deshabilitar los botones al hacer clic en uno de ellos
    setControlCorrect(true);
    console.log(correct);
    handleOptionSelect(option);
  };
  
  return (
    <div className="quiz">
       
      <div className="question">
      {question}
      
      </div>
      <div className="answers">
        {options.map((option, index) => (
          //Validacion en caso de que vuelva vacio
          <button className="answer" 
          key={index}  
          onClick={()=> handleButtonClick(option)} 
          disabled={disable}>
            {option}
          </button>
           
        ))}
       </div>

       <div className="question">
        
        {controlCorrect === true ? "Respuesta Correcta: "+correct  :""}
       </div>
    </div>
  );
};

export default Question;