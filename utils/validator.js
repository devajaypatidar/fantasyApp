// utils/validator.js

const players = require('../data/players.json');

const validateTeamEntry = (teamEntry) => {
    if (teamEntry.players.length !== 11) {
        return {
            error: "Team must contain 11 players"
        };
    }

    const teamCount = {
        'Chennai Super Kings': 0,
        'Rajasthan Royals': 0
    };

    const roleCount = {
        "WICKETKEEPER": 0,
        "BATTER": 0,
        "ALL-ROUNDER": 0,
        "BOWLER": 0
    };

    for (let player of teamEntry.players) {
        const playerDetails = players.find(p => p.Player === player);
        if (!playerDetails) {
            return { error: `Player '${player}' not found` };
        }

        teamCount[playerDetails.Team]++;
        roleCount[playerDetails.Role]++;
    }

    // Check maximum 10 players from one team
    if (teamCount['Chennai Super Kings'] > 10 || teamCount['Rajasthan Royals'] > 10) {
        return { error: 'Maximum 10 players are allowed from one team' };
    }

    // Check role distribution
    if (
        roleCount['WICKETKEEPER'] < 1 || roleCount['WICKETKEEPER'] > 8 ||
        roleCount['BATTER'] < 1 || roleCount['BATTER'] > 8 ||
        roleCount['ALL-ROUNDER'] < 1 || roleCount['ALL-ROUNDER'] > 8 ||
        roleCount['BOWLER'] < 1 || roleCount['BOWLER'] > 8
    ) {
        console.log("Invalid Role Distribution ");
        return { error: 'Invalid role distribution' };
    }

    // Validation passed
    return { success: true };
};

module.exports = validateTeamEntry;
