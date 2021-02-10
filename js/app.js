let sounds = [
    {
        "name": "Italy",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/it.mp3"
    },
    {
        "name": "United States",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/us.mp3"
    },
    {
        "name": "Germany",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/de.mp3"
    },
    {
        "name": "France",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/fr.mp3"
    },
    {
        "name": "Israel",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/il.mp3"
    },
    {
        "name": "Netherlands",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/nl.mp3"
    },
    {
        "name": "Poland",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/pl.mp3"
    },
    {
        "name": "India",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/in.mp3"
    },
    {
        "name": "Canada",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/ca.mp3"
    },
    {
        "name": "United Kingdom",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/gb.mp3"
    },
    {
        "name": "Russia",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/ru.mp3"
    },
    {
        "name": "Mexico",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/mx.mp3"
    },
    {
        "name": "Spain",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/es.mp3"
    },
    {
        "name": "Taiwan",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/tw.mp3"
    },
    {
        "name": "China",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/cn.mp3"
    },
    {
        "name": "Australia",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/au.mp3"
    },
    {
        "name": "Austria",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/at.mp3"
    },
    {
        "name": "European Union",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/eu.mp3"
    },
    {
        "name": "Brazil",
        "category": "National Anthem",
        "file": "http://www.nationalanthems.info/br.mp3"
    },
]

function getRandomSubarray(arr, size) {
    let shuffled = arr.slice(0);
    let i = arr.length;
    let temp = 0;
    let index = 0;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

class GameState {
    constructor() {
        this.sounds = new Array();
        this.index = 0;
        this.numRight = 0;
        this.numWrong = 0;
    }
}


class Game {
    constructor() {
        this.gameState = new GameState();
    }

    reset() {
        this.gameState.sounds = getRandomSubarray(this.gameState.sounds, this.gameState.sounds.length);
        this.gameState.index = 0;
        this.gameState.numRight = 0;
        this.gameState.numWrong = 0;
        this.chooseItems();
    }

    isFinished() {
        return this.gameState.index == this.gameState.sounds.length;
    }

    currentSound() {
        return this.gameState.sounds[this.gameState.index];
    }

    chooseItems() {
        // Filter out current index
        let choices = new Array();
        for (let i = 0; i < this.gameState.sounds.length; ++i) {
            if (i != this.gameState.index) {
                choices.push(this.gameState.sounds[i]);
            }
        }

        // Choose other random ones
        choices = getRandomSubarray(choices, 3);

        // Re-add current item
        choices.push(this.currentSound());

        // Re-shuffle
        this.quizChoices = getRandomSubarray(choices, choices.length);
    }

    goNext() {
        this.gameState.index += 1;
        this.chooseItems();
    }
}


function onGameFinished() {
    $("#game-over").show();
    window.localStorage.removeItem("gameState");
}

function nextQuestion() {
    game.goNext();
    $("#msgWrong").hide();
    $("#msgRight").hide();
    $("#msg-area").hide();
    $("#game-over").hide();

    if (game.isFinished()) {
        onGameFinished();
    } else {
        refreshControls();
    }
}

function updateScores() {
    $("#questionNum").html(game.gameState.index + 1);
    $("#score").html(game.gameState.numRight);
    $("#total").html(game.gameState.sounds.length);

    let gameStateJson = JSON.stringify(game.gameState);
    window.localStorage.setItem("gameState", gameStateJson);
}

function onWrongChoice() {
    game.gameState.numWrong += 1;
    updateScores();

    let msg = $("#msgWrong");
    msg.html(`<h1>Nope!<br/>It was <strong>${game.currentSound().name}</strong></h1>`);
    msg.show();

    $("#player-area").hide();
    $("#msgRight").hide();
    $("#msg-area").show();
}

function onRightChoice() {
    game.gameState.numRight += 1;
    updateScores();

    let msg = $("#msgRight");
    msg.html(`<h1>Correct!<br/>It was <strong>${game.currentSound().name}</strong></h1>`);
    msg.show();

    $("#player-area").hide();
    $("#msgWrong").hide();
    $("#msg-area").show();
}

let player = null;

function startPlaying() {
    if (player != null) {
        player.stop();
        player.play();
    }
}

function prepareButtons() {
    let choices = game.quizChoices;
    for (let i = 0; i < choices.length; ++i) {
        let btn = $("#btn" + i.toString());
        btn.html(choices[i].name);

        let handler = onWrongChoice;
        if (choices[i] == game.currentSound()) {
            handler = onRightChoice;
        }
        btn.off('click');
        btn.on('click', handler);
    }
    $('#buttons').show();

    startPlaying();
}

function refreshControls() {
    updateScores();

    $("#game-over").hide();
    $('#buttons').hide();
    $("#msgWrong").hide();
    $("#msgRight").hide();
    $("#msg-area").hide();
    $("#player-area").show();

    let file = game.currentSound().file;

    let btnStop = $("#btnStop");
    let btnPlay = $("#btnPlay");

    if (player != null) {
        player.stop();
        player = null;
    }

    player = new Howl({
        src: [file],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        autoplay: false,
        onplay: function () {
            btnPlay.hide();
            btnStop.show();
        },
        onload: function () {
            btnPlay.show();
            btnStop.hide();
            prepareButtons();
        },
        onstop: function () {
            btnPlay.show();
            btnStop.hide();
        },
        onend: function () {
            btnPlay.show();
            btnStop.hide();
        }
    });

    startPlaying();
}

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

function loadGameState() {
    let gameStateJson = window.localStorage.getItem("gameState");
    if (gameStateJson != null) {
        let state = JSON.parse(gameStateJson);

        if (state.sounds.length != sounds.length) {
            return null;
        }

        for (let i = 0; i < state.sounds; ++i) {
            if (!deepEqual(state.sounds[i], sounds[i])) {
                return null;
            }
        }
        return state;
    }
    return null;
}

function start() {
    $("#btnRestart").click(function () {
        window.localStorage.removeItem("gameState");
        window.location.reload();
    });

    game = new Game();
    const gameState = loadGameState();

    if (gameState == null) {
        game.gameState.sounds = sounds;
        game.reset();

        gameStateJson = JSON.stringify(game.gameState);
        window.localStorage.setItem("gameState", gameStateJson);
    } else {
        game.gameState = gameState;
        game.chooseItems();
    }


    updateScores();
    $("#msg-area").hide();
    $("#btnNext").click(nextQuestion);
    $("#btnStop").click(function () {
        if (player != null) { player.stop(); }
    });

    $("#btnPlay").click(function () {
        if (player != null) { player.play(); }
    });

    refreshControls();
}