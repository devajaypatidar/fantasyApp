const validateTeamEntry = require('../utils/validator');
const TeamEntry = require('../models/TeamEntry');
const { error } = require('console');
const match = require('../data/match.json');
const PlayerPerformance = require('../models/PlayerPerformance');
const players = require('../data/players.json');
const addTeamEntry = async (req,res)=>{

   try{
    const team = req.body;
    const validationResult = validateTeamEntry(team); 
    console.log(validationResult);

    if(validationResult.error){
        return res.status(400).json({error: validationResult.error});
    }

    let toSave= new TeamEntry(team);
    await toSave.save();
    
    
    return res.status(201).json({message: "Team entry is Added"});

   }catch(err){
        console.log(error);
        return res.status(500).json({messaage: "Internal Server Error"});
   }
}


const processMatchResult = async (req,res)=>{

    try{

        for(const entry of match){
            const {batter,bowler,batsman_run,isWicketDelivery,kind,player_out,fielders_involved,overs,ballnumber} = entry;
            console.log(overs+" "+ballnumber);

            if (!batter || !bowler) {
                console.log("Warning: Missing playerName for batsman or bowler. Skipping entry:", entry);
                continue;
            }

            let batsmanPerformance = await PlayerPerformance.findOne({
                playerName:batter,
            });
            if(!batsmanPerformance){
                batsmanPerformance = new PlayerPerformance({ playerName: batter });
            }

            let bowlerPerformance = await PlayerPerformance.findOne({
                playerName:bowler
            })

            
            if(!bowlerPerformance){
                bowlerPerformance = new PlayerPerformance({ playerName: bowler });
            }

            if(!isWicketDelivery){
                

                
                batsmanPerformance.runs+=batsman_run;

                if(batsman_run == 4){
                    batsmanPerformance.boundary += 1;
                }else if(batsman_run == 6){
                    batsmanPerformance.sixes +=1;
                }

            }else{
                
                batsmanPerformance.isOut = true;

                if(kind==="lbw" || kind === 'bowled'){
                    bowlerPerformance.wickets += 1;
                    bowlerPerformance.catch +=1;
                }else if(kind ==='caught'){
                    bowlerPerformance.wickets += 1;
                    let fielder = await PlayerPerformance.findOne({playerName:fielders_involved});
                    if(!fielder){
                        fielder = new PlayerPerformance({ playerName: fielders_involved });
                    }
                    fielder.catch+=1;
                    await fielder.save();
                }
            }

            await batsmanPerformance.save();
            await bowlerPerformance.save();
           

        }

        console.log("match result has been processed and saved successfullly");
        res.status(200).json({message: "match result has been processed and saved success"});

        const pp = await PlayerPerformance.find({});
        for(const p of pp){
            p.totalPoints +=p.runs;
            p.totalPoints +=p.sixes * 2;
            p.totalPoints +=p.boundary;
            if(p.runs >=100){
                p.totalPoints += 16;
            }else if(p.runs >=50){
                p.totalPoints +=8;
            }else if(p.runs>=30){
                p.totalPoints +=4;
            }
            if(p.isOut){
                p.totalPoints -=2;
            }

            p.totalPoints += p.wickets * 25;
            p.totalPoints += p.LBW * 8;
            if(p.wickets >= 5){
                p.totalPoints += 25;
            }else if(p.wickets == 5){
                p.totalPoints += 8;
            }else if(p.wickets == 3){
                p.totalPoints += 4;
            }

            p.totalPoints += p.catch * 8;
            if(p.catch>=3){
                p.totalPoints += 3
            }
            p.totalPoints += p.runOut * 12;
            p.totalPoints += p.stumping * 6;

            await p.save();
        }

    }catch (err){
        console.log(err);
        res.status(500).json({messaage: err});
    }



    
    
}

const viewTeamResult = async (req, res) => {
    const allPlayers = await PlayerPerformance.find();
    const allTeam = await TeamEntry.find();
    for(const team of allTeam){
        let totalTeamPoints = 0;
        for(const playerName of team.players){
            const player = allPlayers.find(player => player.playerName === playerName);
            if(player){
                if(playerName === team.captain){
                    totalTeamPoints += player.totalPoints * 2; 
                }else if(playerName === team.viceCaptain){
                    totalTeamPoints += player.totalPoints * 1.5;
                }else{
                    totalTeamPoints += player.totalPoints;
                }
            }
        }

        team.points = totalTeamPoints;
        await team.save();
        console.log(`Total point for the ${team.teamName} : ${totalTeamPoints}`)
    }

    const winningTeam = allTeam.reduce((prevTeam, currentTeam) => {
        return currentTeam.points > prevTeam.points ? currentTeam : prevTeam;
    });
    const winners = allTeam.filter(team => team.points === winningTeam.points);
    res.status(200).json({
        winningTeams : winners,
        allTeam:allTeam,
        allPlayers: allPlayers,
    })


}

module.exports = {
    addTeamEntry: addTeamEntry,
    processMatchResult: processMatchResult,
    viewTeamResult: viewTeamResult
}