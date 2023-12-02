const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      dotenv = require("dotenv"),
      app = express()


messageLog = [];

// allows use of environment variables
dotenv.config()

function generateResponse(input) {
    return "sending back: " + input;
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