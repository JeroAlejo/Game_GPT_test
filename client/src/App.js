import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
//Componentes
import Question from "./components/Question";
import { prizeMoney } from "./components/Prices";
import Timer from "./components/Timer";
import useSound from "use-sound";
//Logos
import LogoEPN from './components/images/EPN.png';
import LogoFIEE from './components/images/logo_FIEE.png';
import LogoAI from './components/images/Openai.webp';
import logoLose from './components/images/perdida2.jpg';
import logoLeave from './components/images/retirada.jpg'
//Sonidos 
import play from './components/sounds/play.mp3';
import correctS from './components/sounds/correct.mp3'
import wrong from './components/sounds/wrong.mp3'
import song from './components/sounds/song.mp3'
import leave from './components/sounds/leave.mp3'
//Vector de prueba para preguntas
const Preguntas = [{ pregunta: "Pregunta de prueba",opciones: ["A","B","C","D"]}]

const App = () => {
  //Estado para almacenar la pregunta, las opciones y el numero de la pregunta
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correct, setCorrect] = useState();
  const[questionNumber, setQuestionNumber] = useState(1);
  const host = "172.29.28.206";

  //Opcion seleccionada y estado verificar el si una pregunta es correcta o no
  const [selectedOption, setSelectedOption] = useState("");
  const [questionCheck, setQuestionCheck] = useState("");

  //Almacenar lo ganado
  const[money, setMoney] = useState("$ 0");
  //Para verificar si el jugador se retira , gana o pierde
  //1 el jugador gano
  //2 el jugador se equivoco o perdio
  //3 el jugador se retirarse 
  const[leaveG, setLeaveG] = useState(0);
  //Sonidos
  const [lestPlay] = useSound(play);
  const [correctAnswer] = useSound(correctS);
  const [wrongAnswer] = useSound(wrong);
  const [songFond] = useSound(song);
  const [leaves] = useSound(leave);
  
//Use effect
  useEffect(() => {
    questionNumber > 1 &&
      setMoney(
        prizeMoney.find((item) => item.id === questionNumber - 1).amount
      );
  }, [questionNumber]);

  //Poner en contexto a la API a penas cargue el juego
  /*useEffect(()=>{
  fetchContextAndQuestion();
  },[]);*/
  

  //Use effect para el question number
  useEffect(() => {
    // Verificamos si la pregunta es correcta para aumentar el índice y limpiamos los estados
    if (questionCheck === "SI") {
      setQuestionNumber((prev) => prev + 1);
      setQuestionCheck("");
      correctAnswer();
      
    } else if (questionCheck === "NO") {
      setMoney("$ 0");
      setLeaveG(2);
      setQuestion("");
      setOptions("");
      wrongAnswer();
    }
  }, [questionCheck]);

  //Use effect para controlar si gana el juego con el numero de la pregunta
  useEffect(() => {
    // Verificamos si la pregunta es correcta para aumentar el índice y limpiamos los estados
    if (questionNumber === 16) {
      setLeaveG(1);
      setQuestion("");
      setOptions([]);
      setQuestionCheck("");
      songFond();
    }else if(questionNumber === 0){
      setLeaveG(0);
      setMoney("$ 0")
      setQuestionNumber(1);
      setQuestionCheck("");
    }
  }, [questionNumber]);


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


  //Funcion para pedir una pregunta a chat GPT y almacenar la pregunta junto con las opciones en el estado
  /*
  const fetchQuestion = async () => {
    try {
      const response = await axios.post("http://localhost:8080/chat", {
        prompt: "Haz una Pregunta al estilo quien quiere ser millonario.", // Puedes personalizar el prompt si lo deseas
      });
      const data = response.data.trim();
      const [parsedQuestion, ...parsedOptions] = data.split("\n");
      // Filtrar opciones vacías y establecer el estado solo con opciones no vacías
      const nonEmptyOptions = parsedOptions.filter((option) => option.trim() !== "");
      //Aqui validacion para el punto 
      setQuestion(parsedQuestion);
      setOptions(nonEmptyOptions);
      console.log(data);
      console.log(options);
    } catch (error) {
      console.error(error);
    }
  };
*/
// Función para eliminar acentos
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Función para convertir a minúsculas y eliminar acentos
const normalizeText = (str) => {
  return removeAccents(str.toLowerCase());
};

const fetchQuestion = async () => {
  try {
    const response = await axios.post("http://"+host+":8080/chat", {
      prompt: "Haz una Pregunta al estilo quien quiere ser millonario.", // Puedes personalizar el prompt si lo deseas
    });
    const data = response.data.trim();
    const lines = data.split('\n');
    const preguntaObjeto = {};

    for (const line of lines) {
      const [clave, valor] = line.split(':');
      if (clave && valor) {
        preguntaObjeto[normalizeText(clave)] = valor.trim();
      }
    }

    // Extraer la pregunta y opciones del objeto
    const question = preguntaObjeto[normalizeText('Pregunta')];
    const options = [
      preguntaObjeto[normalizeText('Opcion 1')],
      preguntaObjeto[normalizeText('Opcion 2')],
      preguntaObjeto[normalizeText('Opcion 3')],
      preguntaObjeto[normalizeText('Opcion 4')],
    ];
    const correctQ = preguntaObjeto[normalizeText('Opcion correcta')]
    // Actualizar los estados
    setQuestion(question);
    setOptions(options);
    setCorrect(correctQ);
    //Sonido 
    lestPlay();
    console.log(preguntaObjeto);
  } catch (error) {
    console.error(error);
  }
};

  //Variable para enviar la respuesta al chat GPT y ver si es verdadera o no
  //asyn 
  const handleOptionSelect = (option) => {
    if(option == correct){
      setQuestionCheck("SI");
    }else{
      setQuestionCheck("NO");
    }
  
  };


  //Envio de la opcion seleccionada 
  const checkAnswer = async (selectedOption) => {
    try {
      const response = await axios.post("http://localhost:8080/check_answer", {
        option : selectedOption,
        question: question,
        options: options
      });

      // Lógica para manejar la respuesta recibida desde el servidor
      const data = response.data.trim();
      console.log(data);
      setQuestionCheck(data);
     
    } catch (error) {
      console.error(error);
    }
  };

  const RetirarClick =()=>{
    setLeaveG(3);
    setQuestion("");
    setOptions([]);
    leaves();
  }

  return (
  
    <div className="App">
    
      <div className="container">
      
        <div className="col-2">
          {leaveG === 3 ? (
            <div>
               <h1 className="results">Te retiras con un Total de {money}</h1>
               <img src={logoLeave} alt="retirada"></img>
               <h3 className="results">Que paso hijo, debiste ir por el millón.</h3>
               <button className="btnAgain" onClick={()=>setQuestionNumber(0)}>Intentalo de Nuevo</button>

            </div>
          ): leaveG === 2 ?(
            <div>
              <h1 className="results">Lo lamento has perdido: {money}</h1> 
              <img src={logoLose} alt="perdida"></img>
              <br></br>
              <button className="btnAgain" onClick={()=>setQuestionNumber(0)}>Intentalo de Nuevo</button>
            </div> 
            
                       
          ): leaveG === 1?(
            <div>
                <h1 className="results">Felcitaciones has ganado quien quiere ser millonario: {money}</h1> 

              <img src="https://i.gifer.com/origin/ee/ee93dbc6d7115c71190ed0e5e16bfbd6_w200.gif" alt="Crash"></img>
              <br></br>
              <button className="btnAgain" onClick={()=>setQuestionNumber(0)}>Volver a jugar</button>
            </div>     
          ): (
            <div>
              <h1 className="results">MILLON-BOT</h1>
              <img className="App-logo" src="https://ccfprosario.com.ar/wp-content/uploads/como-se-hace-el-juego-de-quien-quiere-ser-millonario.jpg"></img>
              <br></br>
              <button className="btnComenzar" onClick={fetchQuestion }>{questionNumber >1? "Siguiente pregunta": "Comencemos el juego"}</button>
            </div>
            
          )}
          
          {question && (
            <Question
              question={question}
              options={options}
              handleOptionSelect={handleOptionSelect}
              questionCheck ={questionCheck}
              correct ={correct}
            />
              )}
           
        </div>
          <div className="col">
            <div className>
              <img className="poli_logo" src={LogoEPN} alt="Logo"></img>
              <img className="poli_logo" src={LogoAI}></img>
              <img className="poli_logo" src={LogoFIEE}></img>
            </div> 
            <h1 className="earned">Monto obtenido: {money}</h1>

            <div>
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
            <div>
            <button className="btnRetirarse" onClick={RetirarClick}>Retirarse</button> 
            </div>
          
          </div> 

       </div>
      
      
    </div>
  );
};

export default App;

