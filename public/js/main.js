
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

function sendComputerMessage(msg) {
    element = document.createElement('div')
    // element.innerHTML = "The instruction \"Drive to the goal\" lacks specific details for the robot. Since the goal position is unknown, and the robot lacks sensors, it's not possible to generate a list of instructions. Provide explicit information on the goal's coordinates or offer a step-by-step algorithm for the robot to follow."
    element.innerHTML = "The interpreted list of instructions for the given prompt is: \n ['FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'SOUTH', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD']"
    element.classList.add("message")
    element.classList.add("msg-computer")

    // TODO: too long messages overflow

    setTimeout(() => {
        chat = document.getElementById("chat-messages")
        chat.appendChild(element)

        code = document.getElementById("code-blocks")
        
        for( let i = 0; i < instructions.length; i++){
            block = document.createElement('div');
            block.innerHTML = instructions[i];
            block.classList.add("block")
            block.classList.add("code-block");
            code.appendChild(block);
            simulation(['FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'SOUTH', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD']);
        }
        

      }, 2000)
    
    
}

window.onload = async function () {
    setProblemMessage("Drive the robot through the maze to the end.");

    const response = await fetch( '/messageLog', {
        method:'GET',
    })

    const data = await response.json();

    console.log(data)

    for(i = 0; i < data.length; i++) {
        if(data[i].type == 'user') {
            sendUserMessage(data[i].message)
        } else {
            sendComputerMessage(data[i].message)
        }
    }

    // simulation();
    
    button = document.getElementById("user-input-button")
    input = document.getElementById("user-input-field")
    button.onclick = function() { sendUserMessage(input.value) }
}
