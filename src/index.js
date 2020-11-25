const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const hbs = require('hbs');
var bodyParser = require('body-parser');
const { addGame, removeGame, removeGameById, getGame, getGameById, joinGame, getPlayersInGame, getAvailableGames } = require('./utils/games');
const e = require('express');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // On join, edit the game object with the given code. If two players have joined the same game, start the game.
    socket.on('join', ({ displayName, code }, callback) => {
        // Attempt to join a game
        const { error, game } = joinGame(socket.id, displayName, code);

        if (error) {
            return callback(error);
        }

        // Join the room. The room uses the game code.
        socket.join(code)

        // When a game has two players, start the game
        if (getPlayersInGame(code) === 2) {
            // Send each player the other's display name
            io.to(code).emit('sendNames', { "player1Name": game.player1, "player2Name" : game.player2 });
        }
        
        callback()
    })

    // On sendMessage, emit message to all members in the room
    socket.on('sendMessage', ({ displayName, code, message }, callback) => {
        io.to(code).emit('message', { displayName, message });
        callback()
    })

    // On disconnect, cancel the game.
    socket.on('disconnect', () => {
        // Remove the game from the game collection
        const game = removeGameById(socket.id);
        
        // Cancel the game
        if (game) {
            io.to(game.code).emit('cancelGame');
        }
    })
});


// Express HTTP Requests
app.post('/create-game', (req, res) => {
    res.render('edit');
});


// Post request for starting a game. Creates the game object, and renders the page.
app.post('/host', (req, res) => {
    const choices = [];
    for (var i = 1; i < 25; i++) {
        let imageUrl = req.body["choice-imageUrl-" + i];
        if (imageUrl === '') {
            imageUrl = "img/placeholder-img.png";
        }
        choices.push({
            name: req.body["choice-name-" + i],
            imageUrl
        });
    }
    
    if (!req.body.code) {
        return res.status(500).send();
    }

    addGame(req.body.code, choices);
    res.render('host', {
        displayName: req.body.displayName,
        code: req.body.code,
        choice1: choices[0],
        choice2: choices[1],
        choice3: choices[2],
        choice4: choices[3],
        choice5: choices[4],
        choice6: choices[5],
        choice7: choices[6],
        choice8: choices[7],
        choice9: choices[8],
        choice10: choices[9],
        choice11: choices[10],
        choice12: choices[11],
        choice13: choices[12],
        choice14: choices[13],
        choice15: choices[14],
        choice16: choices[15],
        choice17: choices[16],
        choice18: choices[17],
        choice19: choices[18],
        choice20: choices[19],
        choice21: choices[20],
        choice22: choices[21],
        choice23: choices[22],
        choice24: choices[23]
    });
});

// Post request for joining a game. Renders the page.
app.post('/game', (req, res) => {
    const game = getGame(req.body.code);

    var choices = {};
    if (game) {
        choices = game.choices;
    }

    res.render('game', {
        displayName: req.body.displayName,
        code: req.body.code,
        choices,
        choice1: choices[0],
        choice2: choices[1],
        choice3: choices[2],
        choice4: choices[3],
        choice5: choices[4],
        choice6: choices[5],
        choice7: choices[6],
        choice8: choices[7],
        choice9: choices[8],
        choice10: choices[9],
        choice11: choices[10],
        choice12: choices[11],
        choice13: choices[12],
        choice14: choices[13],
        choice15: choices[14],
        choice16: choices[15],
        choice17: choices[16],
        choice18: choices[17],
        choice19: choices[18],
        choice20: choices[19],
        choice21: choices[20],
        choice22: choices[21],
        choice23: choices[22],
        choice24: choices[23]
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMsg: 'Page not found.',
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
});