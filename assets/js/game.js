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
const MOVIMENTS = 7
const SOUND_TRACK = new Audio("./assets/tracks/soundtrack.mp3")
SOUND_TRACK.loop = true

const gamePlay = document.querySelector(".js-gamePlay")
const gameCongratulations = document.querySelector(".js-gameCongratulations")
const gameInfo = document.querySelector(".js-gameInfo")
const gameMoviments = document.querySelector(".js-gameMoviments")
const playButton = document.querySelector(".js-playButton")

const createGame = (matriz = []) => matriz.forEach(line => insertInGame(line))
const hideElement = element => element.style.display = "none"
const insertInGame = line => line.forEach(memory => gamePlay.appendChild(memoryTemplate(memory)))
const play = track => new Audio(`./assets/tracks/${track}.mp3`).play()
const playMatched  = () => play("matched")
const playSoundTrack = () => SOUND_TRACK.play()
const playUnMatched  = () => play("unmatched")
const removeSelectedClass = (...types) => types.forEach(type => type.classList.remove("is-selected"))
const resetGame = () => gamePlay.innerHTML = ""
const showElement = (element, display = "") => element.style.display = display.length ? display : "block"
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

function checkLose() {
    if (parseInt(gameMoviments.textContent) === 0) {
        gameCongratulations.textContent = "Sorry, you lose !!!"
        gameCongratulations.classList.add("is-loser")
        finishGame()
    }
}

function checkWon() {
    const memoryPending = gamePlay.querySelector("[data-matched=false")
    if (!memoryPending) {        
        gameCongratulations.textContent = "Congratulations, you win !!!"
        gameCongratulations.classList.add("is-winner")
        finishGame()
    }
}

function decreaseAttempts() {
    gameMoviments.textContent = parseInt(gameMoviments.textContent) - 1
}

function finishGame() {
    playButton.children[0].textContent = "Play Again"
    hideElement(gamePlay)
    hideElement(gameInfo)
    showElement(playButton)
    showElement(gameCongratulations)
    SOUND_TRACK.pause()
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
    gameMoviments.textContent = MOVIMENTS
    resetGame()
    createGame(sortMemories())
    hideElement(playButton)
    hideElement(gameCongratulations)
    showElement(gamePlay, "grid")
    showElement(gameInfo)
    playSoundTrack()
}

function typesMatched(first, second) {
    removeSelectedClass(first, second)
    addMatched(first, second)
    playMatched()
    checkWon()
}

function typesUnMatched(first, second) {
    addUnMatchedClass(first, second)
    decreaseAttempts()
    playUnMatched()
    checkLose()
}