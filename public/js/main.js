// const { run } = require("node:test");

let instructions = ["START",'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'SOUTH', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD',"END"];
let valid_instructions = ["FORWARD","NORTH","SOUTH","EAST","WEST"];

function setProblemMessage(msg) {
    element = document.getElementById("problem-message");
    element.innerHTML = msg;
}

function sendUserMessage(msg) {
    element = document.createElement('div')
    element.innerHTML = msg
    element.classList.add("message")
    element.classList.add("msg-user")

    // let instructions = ["START","FORWARD","NORTH","FORWARD","EAST","FORWARD","FORWARD","END"];
    
    if(valid_instructions.includes(msg)){
        instructions.push(msg);
    }
    if(msg === "END"){
        // simulation(instructions);
    }
    // TODO: too long messages overflow

    chat = document.getElementById("chat-messages")
    chat.appendChild(element)
}

function sendComputerMessage(msg, run_sim) {
    element = document.createElement('div')
    // element.innerHTML = "The instruction \"Drive to the goal\" lacks specific details for the robot. Since the goal position is unknown, and the robot lacks sensors, it's not possible to generate a list of instructions. Provide explicit information on the goal's coordinates or offer a step-by-step algorithm for the robot to follow."
    // element.innerHTML = "The interpreted list of instructions for the given prompt is: \n ['FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'SOUTH', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD']"
    element.innerHTML = msg
    element.classList.add("message")
    element.classList.add("msg-computer")
    chat = document.getElementById("chat-messages")
    chat.appendChild(element)

    if(run_sim) { // only run the simulation if the last message sent was from the computer
        setTimeout(() => {

            code = document.getElementById("code-blocks")
            while (code.firstChild) {
                code.removeChild(code.lastChild);
              }
            
            instructions = parseInstructions(msg)

            for( let i = 0; i < instructions.length; i++){
                block = document.createElement('div');
                block.innerHTML = instructions[i];
                block.classList.add("block")
                block.classList.add("code-block");
                code.appendChild(block);
                simulation(instructions);
            }
            
    
          }, 2000)
    }
}

function parseInstructions(msg) {
    // TODO parse the message
    open_bracket = msg.indexOf('[');
    close_bracket = msg.indexOf(']')

    temp = msg.substring(open_bracket+1, close_bracket).split(',')
    instructions = []

    for(i = 0; i < temp.length; i++) {
        temp[i] = temp[i].replaceAll('"', '').toUpperCase()
        var allowedWords = ['FORWARD', 'NORTH', 'SOUTH', 'EAST', 'WEST'];
        var pattern = new RegExp('\\b(?!(?:' + allowedWords.join('|') + ')\\b)\\w+\\b', 'g');
        temp[i] = temp[i].replaceAll(pattern, "")
        temp[i] = temp[i].replaceAll(" ", "")
        temp[i] = temp[i].replaceAll("\t", "")
        
        for(j = 0; j < allowedWords.length; j++) {
            if (allowedWords[j] == temp[i]) {
                instructions.push(temp[i])
                break;
            }
        }
    }

    instructions.push("END")

    console.log("These are the parsed instructions: " + instructions)

    return instructions

}

window.onload = async function () {
    setProblemMessage("Drive the robot through to the green square");
    simulation([]);
    const response = await fetch( '/messageLog', {
        method:'GET',
    })

    const data = await response.json();

    for(i = 0; i < data.length; i++) {
        if(data[i].type == 'user') {
            sendUserMessage(data[i].message)
        } else {
            sendComputerMessage(data[i].message, i == (data.length-1))
        }
    }

    
    button = document.getElementById("user-input-button")
    input = document.getElementById("user-input-field")
    button.onclick = function() { sendUserMessage(input.value) }
}
