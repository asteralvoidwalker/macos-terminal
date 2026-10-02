/* =========================================
   macOS TERMINAL
   APPLICATION CONTROLLER
   ========================================= */

const terminalWindow =
    document.getElementById("terminalWindow");

const closeButton =
    document.getElementById("closeButton");

const minimizeButton =
    document.getElementById("minimizeButton");

const maximizeButton =
    document.getElementById("maximizeButton");

const terminalElement =
    document.getElementById("terminal");

let isMaximized = false;


/* =========================================
   CLOSE
   ========================================= */

closeButton.addEventListener("click", function () {

    terminalWindow.classList.add("window-closed");

});


/* =========================================
   MINIMIZE
   ========================================= */

minimizeButton.addEventListener("click", function () {

    terminalWindow.classList.toggle("window-minimized");

});


/* =========================================
   MAXIMIZE
   ========================================= */

maximizeButton.addEventListener("click", function () {

    isMaximized = !isMaximized;

    terminalWindow.classList.toggle(
        "window-maximized",
        isMaximized
    );

    setTimeout(() => {

        if (typeof focusTerminal === "function") {
            focusTerminal();
        }

    }, 100);

});


/* =========================================
   DOUBLE CLICK TITLE BAR
   ========================================= */

const titleBar =
    document.querySelector(".title-bar");

titleBar.addEventListener("dblclick", function () {

    isMaximized = !isMaximized;

    terminalWindow.classList.toggle(
        "window-maximized",
        isMaximized
    );

});


/* =========================================
   ESCAPE FROM MAXIMIZED MODE
   ========================================= */

document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        isMaximized
    ) {

        isMaximized = false;

        terminalWindow.classList.remove(
            "window-maximized"
        );

        focusTerminal();
    }

});
