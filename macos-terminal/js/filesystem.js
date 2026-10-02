/* =========================================
   macOS TERMINAL
   VIRTUAL FILESYSTEM
   ========================================= */

const FILESYSTEM_STORAGE_KEY = "macos-terminal-filesystem";

const DEFAULT_FILE_SYSTEM = {
    type: "directory",
    name: "/",
    children: {
        Applications: {
            type: "directory",
            name: "Applications",
            children: {}
        },

        Library: {
            type: "directory",
            name: "Library",
            children: {}
        },

        System: {
            type: "directory",
            name: "System",
            children: {}
        },

        Users: {
            type: "directory",
            name: "Users",
            children: {
                dagi: {
                    type: "directory",
                    name: "dagi",
                    children: {
                        Desktop: {
                            type: "directory",
                            name: "Desktop",
                            children: {}
                        },

                        Documents: {
                            type: "directory",
                            name: "Documents",
                            children: {}
                        },

                        Downloads: {
                            type: "directory",
                            name: "Downloads",
                            children: {}
                        },

                        Movies: {
                            type: "directory",
                            name: "Movies",
                            children: {}
                        },

                        Music: {
                            type: "directory",
                            name: "Music",
                            children: {}
                        },

                        Pictures: {
                            type: "directory",
                            name: "Pictures",
                            children: {}
                        },

                        Public: {
                            type: "directory",
                            name: "Public",
                            children: {}
                        }
                    }
                }
            }
        },

        Volumes: {
            type: "directory",
            name: "Volumes",
            children: {}
        }
    }
};


/* =========================================
   LOAD FILESYSTEM
   ========================================= */

function loadFileSystem() {

    const saved =
        localStorage.getItem(FILESYSTEM_STORAGE_KEY);

    if (!saved) {
        return structuredClone(DEFAULT_FILE_SYSTEM);
    }

    try {
        return JSON.parse(saved);
    } catch (error) {

        console.warn(
            "Could not load saved filesystem. Resetting."
        );

        return structuredClone(DEFAULT_FILE_SYSTEM);
    }
}


/* =========================================
   FILESYSTEM
   ========================================= */

let fileSystem = loadFileSystem();


/* =========================================
   SAVE FILESYSTEM
   ========================================= */

function saveFileSystem() {

    localStorage.setItem(
        FILESYSTEM_STORAGE_KEY,
        JSON.stringify(fileSystem)
    );
}


/* =========================================
   CURRENT DIRECTORY
   ========================================= */

let currentPath = [
    "Users",
    "dagi"
];


/* =========================================
   GET DIRECTORY FROM PATH
   ========================================= */

function getDirectory(path) {

    let current = fileSystem;

    for (const part of path) {

        if (
            !current.children ||
            !current.children[part]
        ) {
            return null;
        }

        current = current.children[part];
    }

    return current;
}


/* =========================================
   CURRENT DIRECTORY
   ========================================= */

function getCurrentDirectory() {

    return getDirectory(currentPath);
}


/* =========================================
   CURRENT PATH
   ========================================= */

function getCurrentPath() {

    if (currentPath.length === 0) {
        return "/";
    }

    return "/" + currentPath.join("/");
}


/* =========================================
   CREATE DIRECTORY
   ========================================= */

function createDirectory(name) {

    const directory = getCurrentDirectory();

    if (!directory) {
        return false;
    }

    if (directory.children[name]) {
        return false;
    }

    directory.children[name] = {
        type: "directory",
        name: name,
        children: {}
    };

    saveFileSystem();

    return true;
}


/* =========================================
   CREATE FILE
   ========================================= */

function createFile(name, content = "") {

    const directory = getCurrentDirectory();

    if (!directory) {
        return false;
    }

    if (directory.children[name]) {
        return false;
    }

    directory.children[name] = {
        type: "file",
        name: name,
        content: content
    };

    saveFileSystem();

    return true;
}


/* =========================================
   DELETE ITEM
   ========================================= */

function deleteItem(name) {

    const directory = getCurrentDirectory();

    if (
        !directory ||
        !directory.children[name]
    ) {
        return false;
    }

    delete directory.children[name];

    saveFileSystem();

    return true;
}


/* =========================================
   RESET FILESYSTEM
   ========================================= */

function resetFileSystem() {

    const confirmed = confirm(
        "Reset the virtual macOS filesystem?"
    );

    if (!confirmed) {
        return false;
    }

    fileSystem =
        structuredClone(DEFAULT_FILE_SYSTEM);

    currentPath = [
        "Users",
        "dagi"
    ];

    saveFileSystem();

    return true;
}
