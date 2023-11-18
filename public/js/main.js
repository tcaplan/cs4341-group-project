
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

window.onload = function () {
    setProblemMessage("testing 1 2");
    sendUserMessage("testing 1 2");
    sendComputerMessage("another test");
    sendComputerMessage("testing a really long messgae ksadjfladfjdskfladksfjkaddfjsldkfjldsfjfjd;cfidsjfidasjfadsfhadsafhdsfj");
}
