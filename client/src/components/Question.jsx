import React from "react";
import './styles/Question.css';

//Recibimos la pregunta, las opciones y un metodo para almacenar 
//Recibimos si la pregunta fue correcta
const Question = ({ question, options, handleOptionSelect, questionCheck }) => {

  
  return (
    <div className="quiz">
      
      <div className="question">
      {question}
      
      </div>
      <div className="answers">
        {options.map((option, index) => (
          
          <button className="answer" key={index} onClick={() => handleOptionSelect(option)}>
            {option}
          </button>
           
        ))}
       </div>

       <div className="question">
        
        {questionCheck === "SI" ? "Respuesta Correcta" : questionCheck ==="NO"? "Has fallado": ""}
       </div>
    </div>
  );
};

export default Question;