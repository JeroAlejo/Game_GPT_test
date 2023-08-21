const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {Configuration, OpenAIApi} = require("openai");

const config = new Configuration({
    //Gratuito
    //apiKey: "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"

    //Pago
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
        model: "text-davinci-003", //text-davinci-003
        max_tokens: 512,
        temperature: 0,
        prompt: "Vamos a jugar quien quiere ser millonario y tu te encargaras de hacer las preguntas, si estas listo solo responde con:"
        +"El juego va a comenzar, luego espera y no hagas nada.",
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
        prompt: prompt+" Cada vez que te pida una pregunta retornala en este formato: "+
        "Pregunta \nOpcion 1 \nOpcion 2 \nOpcion 3 \nOpcion 4 \nOpcion correcta"+
        " y La Opcion debe ser escrita igual que las opciones. Aqui tienes un ejemplo de como se deberia ver: "+
        "Pregunta: ¿Cuál de los siguientes países no pertenece a la Unión Europea? \nOpcion 1: Italia \nOpcion 2: Francia\nOpcion 3: Noruega \nOpcion 4: España \nOpcion correcta: Noruega"
        +"trata de evitar poner comillas y espacios innecesarios"
        
    });
    console.log(completion.data.choices[0].text);
    res.send(completion.data.choices[0].text);
})


/*
app.post("/chat", async(req, res) =>{

    const {prompt} = req.body;
    
    try{
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0.6,
        prompt: prompt + " Obligatoriamente retorname esa pregunta con el siguiente formato: Pregunta, salto de linea, opcion 1 , salto de linea, opcion 2, salto de linea, opcion 3, salto de linea, opcion 4",
    });

    res.send(completion.data.choices[0].message.content);
}catch(error){
    console.error(error);
    res.status(500).send("Error al interactuar con el modelo.")
}
})*/

//Para enviar la respuesta hecha por el usuario
app.post("/check_answer", async(req, res) =>{

    const {question,option,options} = req.body;
    

    const prompt = "Estamos jugando quien quiere ser millonario y la pregunta es la siguiente: "+
    question+", las opciones son: "+options+" y la opcion selecionada fue: "+option+". Si la respuesta es correcta enviame un 'SI', "+
    "Si la respuesta es incorrecta enviame un 'NO'."
    console.log(prompt);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0.8,
        prompt: prompt,
    });
    console.log(completion.data.choices[0].text);
    res.send(completion.data.choices[0].text);
   
})


const port = 8080;
app.listen(port, ()=> {
    console.log("Server listening on port: "+port);
});
