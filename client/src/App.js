import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
//Componentes
import Question from "./components/Question";
import { prizeMoney } from "./components/Prices";
import Timer from "./components/Timer";


//Vector de prueba para preguntas
const Preguntas = [{ pregunta: "Pregunta de prueba",opciones: ["A","B","C","D"]}]

const App = () => {
  //Estado para almacenar la pregunta, las opciones y el numero de la pregunta
  const [question, setQuestion] = useState(Preguntas[0].pregunta);
  const [options, setOptions] = useState(Preguntas[0].opciones);
  const[questionNumber, setQuestionNumber] = useState(1);

  //Opcion seleccionada y estado verificar el si una pregunta es correcta o no
  const [selectedOption, setSelectedOption] = useState("");
  const [questionCheck, setQuestionCheck] = useState("");

  //Temporizador 
  const [timeOut, setTimeOut] = useState(false);
  //Almacenar lo ganado
  const[money, setMoney] = useState("$ 0");

  


//Use effect
  useEffect(() => {
    questionNumber > 1 &&
      setMoney(
        prizeMoney.find((item) => item.id === questionNumber - 1).amount
      );
  }, [questionNumber]);

      
  useEffect(()=>{
  fetchContextAndQuestion();
  },[]);

  //Metodo para poner en contexto al api
  const fetchContextAndQuestion = async () => {
    try {
      // Obtener el contexto introductorio del servidor
      const response = await axios.post("http://localhost:8080/contexto");

      // Establecer el contexto introductorio en el estado si es necesario mostrarlo en el cliente
      const contextIntro = response.data.trim();
      console.log(contextIntro);
    } catch (error) {
      console.error(error);
    }
  };

  //Use effect para el question number
  useEffect(() => {
    // Verificamos si la pregunta es correcta para aumentar el índice y limpiamos los estados
    if (questionCheck === "SI") {
      setQuestionNumber((prev) => prev + 1);
      setQuestionCheck("");
    } else if (questionCheck === "NO") {
      setQuestionNumber(1);
    }
  }, [questionCheck]);


  //Funcion para pedir una pregunta a chat GPT y almacenar la pregunta junto con las opciones en el estado
  const fetchQuestion = async () => {
    try {
      const response = await axios.post("http://localhost:8080/chat", {
        prompt: "Nueva pregunta al estilo quien quiere ser millonario. ", // Puedes personalizar el prompt si lo deseas
      });
      const data = response.data.trim();
      const [parsedQuestion, ...parsedOptions] = data.split("\n");

      setQuestion(parsedQuestion);
      setOptions(parsedOptions);
      console.log(data);
      console.log(options);
    } catch (error) {
      console.error(error);
    }
  };



  //Variable para enviar la respuesta al chat GPT y ver si es verdadera o no
  //asyn 
  const handleOptionSelect = (option) => {
    //Almacenamos la opcion seleccionada en el estado
    setSelectedOption(option);
    console.log(option);
    //Metodo para hacer la consulta al ai 
    checkAnswer(option);
  
  };


  //Envio de la opcion seleccionada 
  const checkAnswer = async (selectedOption) => {
    try {
      const response = await axios.post("http://localhost:8080/check_answer", {
        option : selectedOption,
      });

      // Lógica para manejar la respuesta recibida desde el servidor
      const data = response.data.trim();
      console.log(data);
      setQuestionCheck(data);
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
    
      <div className="container">
      
        <div className="col-2">
        
          <img className="App-logo" src="https://ccfprosario.com.ar/wp-content/uploads/como-se-hace-el-juego-de-quien-quiere-ser-millonario.jpg"></img>
          <br></br>
          <button onClick={fetchQuestion}>{questionNumber >1? "Siguiente pregunta": "Comencemos el juego"}</button>
          {question && (
            <Question
              question={question}
              options={options}
              handleOptionSelect={handleOptionSelect}
              questionCheck ={questionCheck}
            />
              )}
           
          </div>
          <div className="col">
            <div className="container">
              <img className="poli_logo" src="" alt="Logo"></img>
            </div> 
            <h1 className="earned">Monto obtenido: {money}</h1>

            {prizeMoney.map((item) => (
              <ul className="listmoney">
                <li key={item.id}
                  className={
                    questionNumber === item.id ? "item active" : "item"
                    }
                  >
                    <h5 className="amount">{item.amount}</h5>
                </li>
              </ul>
            ))}
        </div> 

      </div>
      
      
    </div>
  );
};

export default App;

