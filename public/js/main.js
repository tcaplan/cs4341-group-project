function setProblemMessage(msg) {
    element = document.getElementById("problem-message");
    element.innerHTML = msg;
}

function sendUserMessage(msg) {
    element = document.createElement('div')
    element.innerHTML = msg
    element.classList.add("message")
    element.classList.add("msg-user")

    // TODO: too long messages overflow

    chat = document.getElementById("chat-messages")
    chat.appendChild(element)
}

function sendComputerMessage(msg) {
    element = document.createElement('div')
    element.innerHTML = msg
    element.classList.add("message")
    element.classList.add("msg-computer")

    // TODO: too long messages overflow

    chat = document.getElementById("chat-messages")
    chat.appendChild(element)
}

window.onload = async function () {
    setProblemMessage("testing 1 2");

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

    simulation();
    
    button = document.getElementById("user-input-button")
    input = document.getElementById("user-input-field")
    button.onclick = function() { sendUserMessage(input.value) }
}
