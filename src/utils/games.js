const games = [];

const addGame = (code, choices) => {
    // Validation
    if (!code) {
        return {
            error: 'A game code is required!'
        };
    }

    // Check for an existing code
    const existingGame = games.find((game) => game.code === code)
    if (existingGame) {
        return {
            error: 'Try a different game code.'
        };
    }

    // Initialize game object and push it to the games array
    const game = { 
        code, 
        player1: undefined, 
        player2: undefined,
        player1Id: undefined,
        player2Id: undefined,
        choices
    };
    games.push(game);
}

const removeGame = (code) => {
    // Check for the code
    const index = games.findIndex((game) => game.code === code);
    
    // Remove game
    if (index !== -1) {
        return games.splice(index, 1)[0];
    }
}

const removeGameById = (id) => {
    // Check for the id
    const index = games.findIndex((game) => (game.player1Id === id || game.player2Id === id));

    // Remove game
    if (index !== -1) {
        return games.splice(index, 1)[0];
    }
}

const getGame = (code) => {
    return games.find((game) => game.code === code);
}

const getGameById = (id) => {
    return games.find((game) => (game.player1Id === id || game.player2Id === id));
}

const joinGame = (id, displayName, code) => {
    var game = getGame(code);

    // Check if the game with the given code exists
    if (!game) {
        return {
            error: 'Try a different game code'
        };
    }

    // Check if the game already has two players
    if (game.player1 && game.player2) {
        return {
            error: 'This game already has two players'
        };
    }
    
    // Player 1 joins first, player 2 second
    if (!game.player1) {
        game.player1 = displayName;
        game.player1Id = id;
    } else {
        // Player 1 and player 2 should not have the same name
        if (displayName == game.player1) {
            return {
                error: 'Try a different display name'
            };
        }
        game.player2 = displayName;
        game.player2Id = id;
    }

    return { game };
}

const getPlayersInGame = (code) => {
    const game = getGame(code);
    var count = 0;
    
    if (game.player1) {
        count++;
    }
    if (game.player2) {
        count++;
    }

    return count;
} 

const getAvailableGames = () => {
    return games.filter((game) => getPlayersInGame(game.code) === 1);
}


module.exports = {
    addGame,
    removeGame,
    removeGameById,
    getGame,
    getGameById,
    joinGame,
    getPlayersInGame,
    getAvailableGames,
}