// Declarando constants globais
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
const MOVIMENTS = 30
const SOUND_TRACK = new Audio("./assets/tracks/soundtrack.mp3")
SOUND_TRACK.loop = true // Informando que o audio deve tocar sempre
const TIME_ONE_SECOND = 1000

// Buscando elementos principais na página
const gamePlay = document.querySelector(".js-gamePlay")
const gameCongratulations = document.querySelector(".js-gameCongratulations")
const gameInfo = document.querySelector(".js-gameInfo")
const gameMoviments = document.querySelector(".js-gameMoviments")
const gameMovimentsDone = document.querySelector(".js-gameMovimentsDone")
const gameScore = document.querySelector(".js-gameScore")
const gameStats = document.querySelector(".js-gameStats")
const gameTime = document.querySelector(".js-gameTime")
const playButton = document.querySelector(".js-playButton")
const restartButton = document.querySelector(".js-restartButton")

let MOVIMENTS_DONE = 0
let STARS = 3
let TIMER = 0

// Funções pequenas e simples
const activeMemories = () => Array.from(gamePlay.children).forEach(activeMemory)
const activeMemory = memory => memory.classList.remove("is-disabled")
const createGame = (matriz = []) => matriz.forEach(insertInGame)
const disabledMemories = () => Array.from(gamePlay.children).forEach(disabledMemory)
const disabledMemory = memory => memory.classList.add("is-disabled")
const hideElement = element => element.style.display = "none"
const insertInGame = line => line.forEach(memory => gamePlay.appendChild(memoryTemplate(memory)))
const play = track => new Audio(`./assets/tracks/${track}.mp3`).play()
const playMatched  = () => play("matched")
const playSoundTrack = () => SOUND_TRACK.play()
const playUnMatched  = () => play("unmatched")
const removeSelectedClass = (...types) => types.forEach(type => type.classList.remove("is-selected"))
const resetGame = () => gamePlay.innerHTML = ""
const showElement = (element, display = "block") => element.style.display = display
const showStats = () => gameStats.classList.add("is-winner")
const typesSelectedsAreEquals = (first, second) => first.dataset.type === second.dataset.type
const updateTime = time => gameTime.textContent = formatTime(time)

// Adicionando classe e estado para memórias que são iguais
function addMatched(...types) {
    types.forEach(type => {
        type.classList.add("is-matched")
        type.dataset.matched = true
        setTimeout(() => {
            type.classList.remove("is-selected")
            activeMemories()
        }, TIME_ONE_SECOND)
    })
}

// Adicionando classe e estado para memórias que não são iguais
function addUnMatchedClass(...types) {
    types.forEach(type => {
        type.classList.add("is-unmatched")
        setTimeout(() => {
            type.classList.remove("is-unmatched")
            type.classList.remove("is-selected")
            activeMemories()
        }, TIME_ONE_SECOND)
    })
}

// Verificando se o usuário perdeu
function checkLose() {
    if (parseInt(gameMoviments.textContent) === 0) {
        gameCongratulations.textContent = "Sorry, you lose !!!"
        gameCongratulations.classList.add("is-loser")
        hideElement(gameStats)
        finishGame()
    }
}

// Verificando quantidade de pontuação
function checkStars() {
    if (MOVIMENTS_DONE === 12) {
        STARS--
    } else if (MOVIMENTS_DONE === 20) {
        STARS--
    }
    updateStarts()
}

// Verificando se o usuário ganhou
function checkWon() {
    const memoryPending = gamePlay.querySelector("[data-matched=false")
    if (!memoryPending) {        
        gameCongratulations.textContent = "Congratulations, you win !!!"
        gameCongratulations.classList.add("is-winner")
        showStats()
        finishGame()
    }
}

// Diminuindo tentativas restantes
function decreaseAttempts() {
    gameMoviments.textContent = parseInt(gameMoviments.textContent) - 1
    movimentDone()
}

// Finalizando o jogo
function finishGame() {
    playButton.children[0].textContent = "Play Again"
    hideElement(gamePlay)
    hideElement(gameInfo)
    hideElement(restartButton)
    showElement(playButton, "flex")
    showElement(gameCongratulations)
    SOUND_TRACK.pause()
    clearInterval(TIMER)
}

// Formatando o tempo
function formatTime(time) {
    // eslint-disable-next-line
    return `Time: ${moment.utc(time * 1000).format("mm:ss")}`
}

// Criando memórias
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

// Setando um novo movimento feito
function movimentDone(moviments = MOVIMENTS_DONE) {
    gameMovimentsDone.textContent = `Moves: ${moviments}`
    MOVIMENTS_DONE++
    checkStars()
}

// Selecionando uma memória
function selectMemory() {
    const memory = this
    let firstSelected = gamePlay.querySelector(".is-selected")
    if (firstSelected) {
        disabledMemories()
        if (typesSelectedsAreEquals(firstSelected, memory)) {
            typesMatched(firstSelected, memory)
        } else {
            typesUnMatched(firstSelected, memory)
        }
        movimentDone()
        firstSelected = null
    }
    memory.classList.add("is-selected")
}

// Sorteando memórias
function sortMemories() {
    const memories = [].concat(MEMORY_TYPES)
    const matriz = []
    for (let i = 0; i < COUNT_MEMORIES; i++) {
        const line = []
        for (let k = 0; k < COUNT_MEMORIES; k++) {
            const randomPosition = Math.floor(Math.random() * (memories.length))
            line[k] = memories[randomPosition]
            memories.splice(randomPosition, 1)
        }
        matriz[i] = line
    }
    return matriz
}

// eslint-disable-next-line
function startGame() {
    MOVIMENTS_DONE = 0
    STARS = 3
    gameStats.classList.remove("is-winner")
    clearInterval(TIMER)
    gameMoviments.textContent = MOVIMENTS
    updateStarts()
    timeStarted()
    movimentDone()
    resetGame()
    createGame(sortMemories())
    hideElement(playButton)
    hideElement(gameCongratulations)
    showElement(gamePlay, "grid")
    showElement(gameInfo)
    showElement(gameStats)
    showElement(restartButton)
    playSoundTrack()
}

// Atualizando e criando o tempo
function timeStarted() {
    let time = 0
    updateTime(time)
    TIMER = setInterval(() => {
        time++
        updateTime(time)
    }, TIME_ONE_SECOND)
}

// Realizando funções para memórias que são iguais
function typesMatched(first, second) {
    removeSelectedClass(first, second)
    addMatched(first, second)
    playMatched()
    checkWon()
}

// Realizando funções para memórias que não são iguais
function typesUnMatched(first, second) {
    addUnMatchedClass(first, second)
    decreaseAttempts()
    playUnMatched()
    checkLose()
}

// Setar quantidade de estrelas do jogador
function updateStarts() {
    Array.from(gameScore.children).forEach(score => score.classList.add("icon-star-empty"))
    for (let i = 0; i < STARS; i++) {
        gameScore.children[i].classList.add("icon-star")
        gameScore.children[i].classList.remove("icon-star-empty")
    }
}