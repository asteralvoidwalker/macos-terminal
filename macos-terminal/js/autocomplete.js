/* =========================================
   macOS TERMINAL
   TAB AUTOCOMPLETE
   ========================================= */

const availableCommands = Object.keys(COMMANDS);

let autocompleteMatches = [];
let autocompleteIndex = 0;
let lastAutocompleteInput = "";


/* =========================================
   RESET AUTOCOMPLETE
   ========================================= */

function resetAutocomplete() {
    autocompleteMatches = [];
    autocompleteIndex = 0;
    lastAutocompleteInput = "";
}


/* =========================================
   GET CURRENT DIRECTORY NAMES
   ========================================= */

function getCurrentDirectoryNames() {

    const directory = getCurrentDirectory();

    if (!directory || !directory.children) {
        return [];
    }

    return Object.keys(directory.children);
}


/* =========================================
   FIND COMMAND MATCHES
   ========================================= */

function findCommandMatches(text) {

    return availableCommands.filter(command =>
        command.startsWith(text)
    );
}


/* =========================================
   FIND FILESYSTEM MATCHES
   ========================================= */

function findFilesystemMatches(text) {

    const names = getCurrentDirectoryNames();

    return names.filter(name =>
        name.startsWith(text)
    );
}


/* =========================================
   COMMON PREFIX
   ========================================= */

function getCommonPrefix(items) {

    if (items.length === 0) {
        return "";
    }

    let prefix = items[0];

    for (let i = 1; i < items.length; i++) {

        while (!items[i].startsWith(prefix)) {

            prefix = prefix.substring(
                0,
                prefix.length - 1
            );

            if (prefix === "") {
                return "";
            }
        }
    }

    return prefix;
}


/* =========================================
   SHOW MATCHES
   ========================================= */

function showAutocompleteMatches(matches) {

    if (matches.length === 0) {
        return;
    }

    printOutput(matches.join("    "));

    scrollToBottom();
}


/* =========================================
   HANDLE TAB
   ========================================= */

function handleAutocomplete() {

    const input = commandInput.value;

    const parts = input.split(/\s+/);

    const command = parts[0] || "";

    const argument = parts.length > 1
        ? parts[parts.length - 1]
        : "";


    /* =====================================
       COMMAND AUTOCOMPLETE
       ===================================== */

    if (parts.length === 1) {

        const matches = findCommandMatches(command);

        if (matches.length === 0) {
            resetAutocomplete();
            return;
        }

        /* One exact match */

        if (matches.length === 1) {

            commandInput.value = matches[0] + " ";

            resetAutocomplete();

            moveCursorToEnd();

            return;
        }


        /* Multiple matches */

        const commonPrefix =
            getCommonPrefix(matches);

        if (commonPrefix.length > command.length) {

            commandInput.value = commonPrefix;

            moveCursorToEnd();

            return;
        }


        /* Repeated TAB */

        if (lastAutocompleteInput === input) {

            showAutocompleteMatches(matches);

        } else {

            lastAutocompleteInput = input;

            autocompleteMatches = matches;

            showAutocompleteMatches(matches);
        }

        return;
    }


    /* =====================================
       FILESYSTEM AUTOCOMPLETE
       ===================================== */

    const matches =
        findFilesystemMatches(argument);

    if (matches.length === 0) {

        resetAutocomplete();

        return;
    }


    /* One match */

    if (matches.length === 1) {

        parts[parts.length - 1] = matches[0];

        commandInput.value =
            parts.join(" ");

        moveCursorToEnd();

        resetAutocomplete();

        return;
    }


    /* Multiple matches */

    const commonPrefix =
        getCommonPrefix(matches);

    if (commonPrefix.length > argument.length) {

        parts[parts.length - 1] = commonPrefix;

        commandInput.value =
            parts.join(" ");

        moveCursorToEnd();

        return;
    }


    /* Repeated TAB */

    if (lastAutocompleteInput === input) {

        showAutocompleteMatches(matches);

    } else {

        lastAutocompleteInput = input;

        autocompleteMatches = matches;

        showAutocompleteMatches(matches);
    }
}


/* =========================================
   KEYBOARD LISTENER
   ========================================= */

commandInput.addEventListener("keydown", function(event) {

    /* TAB */

    if (event.key === "Tab") {

        event.preventDefault();

        handleAutocomplete();

        return;
    }


    /* Any other typing resets autocomplete */

    if (
        event.key.length === 1 ||
        event.key === "Backspace" ||
        event.key === "Delete"
    ) {

        resetAutocomplete();
    }
});
