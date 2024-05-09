const validateTeamEntry = require('../utils/validator');
const TeamEntry = require('../models/TeamEntry');
const { error } = require('console');
const match = require('../data/match.json');

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


const processMatchResult = (req,res)=>{

    
    
    
}

const viewTeamResult = ()=>{
    console.log("viewTeamResult")
}

module.exports = {
    addTeamEntry: addTeamEntry,
    processMatchResult: processMatchResult,
    viewTeamResult: viewTeamResult
}