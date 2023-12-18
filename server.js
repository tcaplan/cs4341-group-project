// const { resolve } = require('path');

const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      dotenv = require("dotenv"),
      bodyParser = require("body-parser"),
      {spawn} = require('child_process'),
      app = express()
      
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

messageLog = [];

// allows use of environment variables
dotenv.config()

async function generateResponse(input) {

    // Reading Python files
    // spawn new child process to call the python script
    
    const getPythonScriptStdout = (pythonScriptPath) => {
        const python = spawn('python3', [pythonScriptPath, input]);

        return new Promise((resolve, reject) => {
            // collect data from script
            let dataToSend = ""

            python.stdout.on('data', function (data) {
                dataToSend += data.toString();
            });

            python.on('close', () => {
                resolve(dataToSend)
            }); 

            python.stderr.on('error', err => {
                resolve(err)
            });
        })
    }

    output = await getPythonScriptStdout('public/scripts/chat_gpt.py').then((output) => {
        return output;
    });

    console.log("got from chat:", output)

    return output
}

// express/cookie set up

// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use( express.urlencoded({ extended: true }) )

// public directory
app.use(express.static('./public'))
app.use(express.json())

app.get('/messagelog', async (request, response) => {
    response.json(messageLog)
})

app.post('/usermessage', async (request, response ) => {

    console.log('received: ' + request.body.input)
    
    messageLog.push({type: 'user', message: request.body.input})

    computerMessage = await generateResponse(request.body.input);

    messageLog.push({type: 'computer', message: computerMessage})
    
    response.redirect('/index.html')
})

// set up the server
app.listen(`${process.env.PORT}` || 3000)