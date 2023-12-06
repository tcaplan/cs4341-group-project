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

function generateResponse(input) {

    // Reading Python files
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python3', ['public/scripts/parser.py', input]);

    // collect data from script
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });

    python.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    python.on('exit', (code) => {
        console.log(`child process exited with code ${code}, ${dataToSend}`);
        // response.sendFile(`${__dirname}/public/index.html`);
    }); 

    return "sending back: " + dataToSend;
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

    computerMessage = generateResponse(request.body.input);

    messageLog.push({type: 'computer', message: computerMessage})

    // response.json(JSON.stringify(messageLog))
    
    response.redirect('/index.html')
})

// set up the server
app.listen(`${process.env.PORT}` || 3000)