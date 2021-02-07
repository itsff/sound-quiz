let sounds = [
    {
        "name": "Italy",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Italy.mid"
    },
    {
        "name": "United States",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_United_States.mid"
    },
    {
        "name": "Germany",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Germany.mid"
    },
    {
        "name": "France",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_France.mid"
    },
    {
        "name": "Israel",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Israel.mid"
    },
    {
        "name": "Netherlands",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Netherlands.mid"
    },
    {
        "name": "Poland",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Poland.mid"
    },
    {
        "name": "India",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_India.mid"
    },
    {
        "name": "Canada",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Canada2.mid"
    },
    {
        "name": "United Kingdom",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_United_Kingdom.mid"
    },
    {
        "name": "Russia",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/national_anthem_russia.mid"
    },
    {
        "name": "Mexico",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Mexico.mid"
    },
    {
        "name": "Spain",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Spain.mid"
    },
    {
        "name": "Taiwan",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Taiwan.mid"
    },
    {
        "name": "China",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/chinami_-_China.mid"
    },
    {
        "name": "Australia",
        "category": "National Anthem",
        "file": "/sound-quiz/midi/National_Anthems_-_Australia.mid"
    },
]

function getRandomSubarray(arr, size)
{
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
 
class GameState
{
    constructor()
    {
        this.sounds = new Array();
        this.index = 0;
        this.numRight = 0;
        this.numWrong = 0;
    }
}


class Game
{
    constructor()
    {
        this.gameState = new GameState();
    }

    reset()
    {
        this.gameState.sounds = getRandomSubarray(this.gameState.sounds, this.gameState.sounds.length);
        this.gameState.index = 0;
        this.gameState.numRight = 0;
        this.gameState.numWrong = 0;
        this.chooseItems();
    }

    isFinished()
    {
        return this.gameState.index == this.gameState.sounds.length;
    }

    currentSound()
    {
        return this.gameState.sounds[this.gameState.index];
    }

    chooseItems()
    {
        // Filter out current index
        let choices = new Array();
        for (let i = 0; i < this.gameState.sounds.length; ++i)
        {
            if (i != this.gameState.index)
            {
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

    goNext()
    {
        this.gameState.index += 1;
        this.chooseItems();
    }
}


function onGameFinished()
{
    $("#game-over").show();
    window.localStorage.removeItem("gameState");
}

function nextQuestion()
{
    game.goNext();
    $("#msgWrong").hide();
    $("#msgRight").hide();
    $("#msg-area").hide();
    $("#game-over").hide();

    if (game.isFinished()) {
        onGameFinished();
    } else {
        startPlaying();
        refreshControls();
    }
}

function updateScores()
{
    $("#questionNum").html(game.gameState.index + 1);
    $("#score").html(game.gameState.numRight);
    $("#total").html(game.gameState.sounds.length);

    let gameStateJson = JSON.stringify(game.gameState);
    window.localStorage.setItem("gameState", gameStateJson);
}

function onWrongChoice()
{
    game.gameState.numWrong += 1;
    updateScores();

    let msg = $("#msgWrong");
    msg.html(`<h1>Nope!<br/>It was <strong>${game.currentSound().name}</strong></h1>`);
    msg.show();

    $("#player-area").hide();
    $("#msgRight").hide();
    $("#msg-area").show();
}

function onRightChoice()
{
    game.gameState.numRight += 1;
    updateScores();

     let msg = $("#msgRight");
    msg.html(`<h1>Correct!<br/>It was <strong>${game.currentSound().name}</strong></h1>`);
    msg.show();

    $("#player-area").hide();
    $("#msgWrong").hide();
    $("#msg-area").show();
}

function prepareButtons()
{
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
}

function startPlaying()
{
    let player = document.getElementById('player');
    player.playButton.click();
}

function refreshControls()
{
    updateScores();

    $("#game-over").hide();
    $('#buttons').hide();
    $("#msgWrong").hide();
    $("#msgRight").hide();
    $("#msg-area").hide();
    $("#player-area").show();

    let file = game.currentSound().file;
    player = document.getElementById('player');
    player.src = file;

    // let visualizer = document.getElementById('visualizer');
    // visualizer.src = file;
}

function start()
{
    $("#btnRestart").click(function() {
        window.localStorage.removeItem("gameState");
        window.location.reload();
    });

    game = new Game();

    let gameStateJson = window.localStorage.getItem("gameState");
    if (gameStateJson == null)
    {
        game.gameState.sounds = sounds;
        game.reset();

        gameStateJson = JSON.stringify(game.gameState);
        window.localStorage.setItem("gameState", gameStateJson);
    }
    else
    {
        game.gameState = JSON.parse(gameStateJson);
        game.chooseItems();
    }

    updateScores();
    $("#msg-area").hide();
    $("#btnNext").click(nextQuestion);

    let player = document.getElementById('player');
    player.addEventListener('load', prepareButtons);

    refreshControls();
}