const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {Configuration, OpenAIApi} = require("openai");

const config = new Configuration({
    //apiKey: "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"
    apiKey: "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"

})

const openai = new OpenAIApi(config);

//SetUp server

const app = express();
app.use(bodyParser.json());
app.use(cors());

//endpoint para poner en contexto al AI 
app.post("/contexto", async(_, res) =>{

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0,
        prompt: "Vamos a jugar quien quiere ser millonario y tu te encargaras de hacer las preguntas, si estas listo solo responde con:"
        +"El juego va a comenzar, y luego espera no hagas ninguna pregunta aun.",
    });

    res.send(completion.data.choices[0].text);

})

//endopint es para generar las preguntas 
app.post("/chat", async(req, res) =>{

    const {prompt} = req.body;
    
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0.6,
        prompt: prompt+" Obligatoriamente retorname esa pregunta con el siguiente formato: "+
        "Pregunta, salto de linea, opcion 1 , salto de linea, opcion 2, salto de linea, opcion 3, salto de linea, opcion 4",
    });

    res.send(completion.data.choices[0].text);
})

//Para enviar la respuesta hecha por el usuario
app.post("/check_answer", async(req, res) =>{

    const {option} = req.body;

    const prompt = "Elijo la opcion: "+option+".Envia SI si la respuesta a la pregunta es correta. "+
    "Envia NO si la respuesta es incorrecta en una sola linea."
    
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0.6,
        prompt: prompt,
    });

    res.send(completion.data.choices[0].text);
})


const port = 8080;
app.listen(port, ()=> {
    console.log("Server listening on port: "+port);
});
