/* =========================================
   macOS TERMINAL
   TERMINAL CONTROLLER
   ========================================= */

const terminal = document.getElementById("terminal");
const terminalOutput = document.getElementById("terminalOutput");
const commandInput = document.getElementById("commandInput");
const prompt = document.getElementById("prompt");

let commandHistory = [];
let historyIndex = -1;


/* =========================================
   FOCUS TERMINAL
   ========================================= */

function focusTerminal() {
    commandInput.focus();
}


/* =========================================
   UPDATE PROMPT
   ========================================= */

function updatePrompt() {

    const path = getCurrentPath();

    let displayPath;

    if (path === "/Users/dagi") {
        displayPath = "~";
    } else if (path.startsWith("/Users/dagi/")) {
        displayPath = "~/" + path.substring("/Users/dagi/".length);
    } else {
        displayPath = path;
    }

    prompt.textContent = `Dagi-Mac:${displayPath} dagi$`;
}


/* =========================================
   PRINT OUTPUT
   ========================================= */

function printOutput(text) {

    if (text === null || text === undefined || text === "") {
        return;
    }

    const outputLine = document.createElement("div");

    outputLine.textContent = text;

    terminalOutput.appendChild(outputLine);

    scrollToBottom();
}


/* =========================================
   PRINT COMMAND
   ========================================= */

function printCommand(command) {

    const commandLine = document.createElement("div");

    const commandPrompt = document.createElement("span");

    commandPrompt.textContent = prompt.textContent;

    const commandText = document.createElement("span");

    commandText.textContent = ` ${command}`;

    commandLine.appendChild(commandPrompt);
    commandLine.appendChild(commandText);

    terminalOutput.appendChild(commandLine);
}


/* =========================================
   SCROLL
   ========================================= */

function scrollToBottom() {

    terminal.scrollTop = terminal.scrollHeight;
}


/* =========================================
   CLEAR CURRENT INPUT
   ========================================= */

function clearInput() {

    commandInput.value = "";
}


/* =========================================
   RUN COMMAND
   ========================================= */

function runCommand() {

    const input = commandInput.value;

    /* Save command */

    if (input.trim() !== "") {

        commandHistory.push(input);

        historyIndex = commandHistory.length;
    }

    /* Show typed command */

    printCommand(input);

    /* Execute */

    const result = executeCommand(input);

    /* Print result */

    if (result !== null && result !== undefined && result !== "") {
        printOutput(result);
    }

    /* Update prompt */

    updatePrompt();

    /* Clear input */

    clearInput();

    /* Keep terminal at bottom */

    scrollToBottom();

    /* Focus */

    focusTerminal();
}


/* =========================================
   KEYBOARD HANDLER
   ========================================= */

commandInput.addEventListener("keydown", function(event) {

    /* ENTER */

    if (event.key === "Enter") {

        event.preventDefault();

        runCommand();

        return;
    }


    /* ARROW UP */

    if (event.key === "ArrowUp") {

        event.preventDefault();

        if (commandHistory.length === 0) {
            return;
        }

        if (historyIndex > 0) {
            historyIndex--;
        }

        commandInput.value =
            commandHistory[historyIndex] || "";

        moveCursorToEnd();

        return;
    }


    /* ARROW DOWN */

    if (event.key === "ArrowDown") {

        event.preventDefault();

        if (commandHistory.length === 0) {
            return;
        }

        if (historyIndex < commandHistory.length - 1) {

            historyIndex++;

            commandInput.value =
                commandHistory[historyIndex];

        } else {

            historyIndex = commandHistory.length;

            commandInput.value = "";
        }

        moveCursorToEnd();

        return;
    }


    /* CTRL + L */

    if (
        event.key.toLowerCase() === "l" &&
        event.ctrlKey
    ) {

        event.preventDefault();

        terminalOutput.innerHTML = "";

        return;
    }

});


/* =========================================
   MOVE CURSOR TO END
   ========================================= */

function moveCursorToEnd() {

    commandInput.focus();

    const length = commandInput.value.length;

    commandInput.setSelectionRange(length, length);
}


/* =========================================
   CLICK TERMINAL TO FOCUS
   ========================================= */

terminal.addEventListener("click", function() {

    focusTerminal();

});


/* =========================================
   INITIALIZE
   ========================================= */

updatePrompt();

focusTerminal();

scrollToBottom();