const COUNT_MEMORIES = 4
const MEMORY_TYPES = [
    "github",
    "github",
    "linux",
    "linux",
    "optin-monster",
    "optin-monster",
    "pied-piper-alt",
    "pied-piper-alt",
    "reddit-alien",
    "reddit-alien",
    "gitlab",
    "gitlab",
    "drupal",
    "drupal",
    "qq",
    "qq"
]

const gamePlay = document.querySelector(".js-gamePlay")
const playButton = document.querySelector(".js-playButton")

const createGame = (matriz = []) => matriz.forEach(line => insertInGame(line))
const hidePlayButton = () => playButton.style.display = "none"
const insertInGame = line => line.forEach(memory => gamePlay.appendChild(memoryTemplate(memory)))
const removeSelectedClass = (...types) => types.forEach(type => type.classList.remove("is-selected"))
const typesSelectedsAreEquals = (first, second) => first.dataset.type === second.dataset.type

function addMatched(...types) {
    types.forEach(type => {
        type.classList.add("is-matched")
        type.dataset.matched = true
    })
}
function addUnMatchedClass(...types) {
    types.forEach(type => {
        type.classList.add("is-unmatched")
        setTimeout(() => {
            type.classList.remove("is-unmatched")        
            type.classList.remove("is-selected")        
        }, 1000)
    })
}

function memoryTemplate(type) {
    const memory = document.createElement("span")
    memory.classList.add("game__memory")
    memory.dataset.type = type
    memory.dataset.matched = false

    const memoryType = document.createElement("i")
    memoryType.classList.add("game__memory___type", `icon-${type}`)

    memory.appendChild(memoryType)
    memory.addEventListener("click", selectMemory)
    return memory
}

function selectMemory() {
    const memory = this
    const firstSelected = gamePlay.querySelector(".is-selected")
    if (firstSelected) {
        setTimeout(() => {
            if (typesSelectedsAreEquals(firstSelected, memory)) {
                typesMatched(firstSelected, memory)
            } else {
                typesUnMatched(firstSelected, memory)
            }
        }, 500)
    }
    memory.classList.add("is-selected")
}

function sortMemories() {
    const memories = [].concat(MEMORY_TYPES)
    const matriz = []
    for (let i = 0; i < COUNT_MEMORIES; i++) {
        const line = []
        for (let k = 0; k < COUNT_MEMORIES; k++) {
            line[k] = memories.pop()
        }
        matriz[i] = line
    }
    return matriz
}

// eslint-disable-next-line
function startGame() {
    hidePlayButton()
    createGame(sortMemories())
}

function typesMatched(first, second) {
    removeSelectedClass(first, second)
    addMatched(first, second)
}

function typesUnMatched(first, second) {
    addUnMatchedClass(first, second)
}