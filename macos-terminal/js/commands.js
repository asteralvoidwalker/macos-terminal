/* =========================================
   macOS TERMINAL
   COMMAND ENGINE
   ========================================= */

const COMMANDS = {};

/* =========================================
   HELP
   ========================================= */

COMMANDS.help = {
    description: "Show available commands",

    execute() {
        return `
Available commands:

  help       Show this help message
  clear      Clear the terminal
  pwd        Print working directory
  ls         List directory contents
  cd         Change directory
  mkdir      Create a directory
  touch      Create a file
  cat        Display a file
  rm         Remove a file
  echo       Print text
  whoami     Show current user
  date       Show current date and time
  uname      Show system information
`;
    }
};


/* =========================================
   PWD
   ========================================= */

COMMANDS.pwd = {
    description: "Print working directory",

    execute() {
        return getCurrentPath();
    }
};


/* =========================================
   LS
   ========================================= */

COMMANDS.ls = {
    description: "List directory contents",

    execute() {

        const directory = getCurrentDirectory();

        if (!directory || !directory.children) {
            return "ls: unable to read directory";
        }

        const names = Object.keys(directory.children);

        if (names.length === 0) {
            return "";
        }

        return names.join("    ");
    }
};


/* =========================================
   CD
   ========================================= */

COMMANDS.cd = {
    description: "Change directory",

    execute(args) {

        if (!args || args.length === 0) {
            currentPath = ["Users", "dagi"];
            return "";
        }

        const target = args[0];

        /* Go to home */

        if (target === "~") {
            currentPath = ["Users", "dagi"];
            return "";
        }

        /* Go to root */

        if (target === "/") {
            currentPath = [];
            return "";
        }

        /* Go up */

        if (target === "..") {

            if (currentPath.length > 0) {
                currentPath.pop();
            }

            return "";
        }

        /* Go into directory */

        const directory = getCurrentDirectory();

        if (
            directory &&
            directory.children[target] &&
            directory.children[target].type === "directory"
        ) {

            currentPath.push(target);

            return "";
        }

        return `cd: no such file or directory: ${target}`;
    }
};


/* =========================================
   MKDIR
   ========================================= */

COMMANDS.mkdir = {
    description: "Create a directory",

    execute(args) {

        if (!args || args.length === 0) {
            return "mkdir: missing operand";
        }

        const name = args[0];

        if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
            return `mkdir: invalid name: ${name}`;
        }

        if (!createDirectory(name)) {
            return `mkdir: cannot create directory '${name}': File exists`;
        }

        return "";
    }
};


/* =========================================
   TOUCH
   ========================================= */

COMMANDS.touch = {
    description: "Create an empty file",

    execute(args) {

        if (!args || args.length === 0) {
            return "touch: missing file operand";
        }

        const name = args[0];

        if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
            return `touch: invalid file name: ${name}`;
        }

        if (!createFile(name)) {
            return `touch: cannot create '${name}': File exists`;
        }

        return "";
    }
};


/* =========================================
   CAT
   ========================================= */

COMMANDS.cat = {
    description: "Display file contents",

    execute(args) {

        if (!args || args.length === 0) {
            return "cat: missing file operand";
        }

        const name = args[0];

        const directory = getCurrentDirectory();

        if (
            !directory ||
            !directory.children[name]
        ) {
            return `cat: ${name}: No such file or directory`;
        }

        const file = directory.children[name];

        if (file.type !== "file") {
            return `cat: ${name}: Is a directory`;
        }

        return file.content || "";
    }
};


/* =========================================
   RM
   ========================================= */

COMMANDS.rm = {
    description: "Remove a file or directory",

    execute(args) {

        if (!args || args.length === 0) {
            return "rm: missing operand";
        }

        const name = args[0];

        const directory = getCurrentDirectory();

        if (
            !directory ||
            !directory.children[name]
        ) {
            return `rm: ${name}: No such file or directory`;
        }

        deleteItem(name);

        return "";
    }
};


/* =========================================
   ECHO
   ========================================= */

COMMANDS.echo = {
    description: "Print text",

    execute(args) {

        return args.join(" ");
    }
};


/* =========================================
   WHOAMI
   ========================================= */

COMMANDS.whoami = {
    description: "Show current user",

    execute() {
        return "dagi";
    }
};


/* =========================================
   DATE
   ========================================= */

COMMANDS.date = {
    description: "Show current date and time",

    execute() {
        return new Date().toString();
    }
};


/* =========================================
   UNAME
   ========================================= */

COMMANDS.uname = {
    description: "Show system information",

    execute() {
        return "Darwin Dagi-Mac 24.6.0 Darwin Kernel Version 24.6.0";
    }
};


/* =========================================
   CLEAR
   ========================================= */

COMMANDS.clear = {
    description: "Clear the terminal",

    execute() {

        const output = document.getElementById(
            "terminalOutput"
        );

        output.innerHTML = "";

        return null;
    }
};


/* =========================================
   UNKNOWN COMMAND
   ========================================= */

function executeCommand(input) {

    const trimmed = input.trim();

    if (!trimmed) {
        return "";
    }

    const parts = trimmed.split(/\s+/);

    const commandName = parts.shift();

    const args = parts;

    const command = COMMANDS[commandName];

    if (!command) {
        return `${commandName}: command not found`;
    }

    try {
        return command.execute(args);
    } catch (error) {

        console.error(error);

        return `${commandName}: command failed`;
    }
}
