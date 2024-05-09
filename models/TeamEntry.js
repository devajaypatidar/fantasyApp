const { MongoMissingCredentialsError } = require('mongodb');
const mongoose = require('mongoose');

const teamEntrySchema = new mongoose.Schema({
    teamName:{
        type:String,
        required:true,
        unique:true,
    },

    players:[{
        type:String,
        required:true,
    }],

    captain:{
        type: String,
        required:true,
    },
    viceCaptain: {
        type: String,
        required:true,
    },
    points:{
        type: Number,
        default:0,
    }


});

const TeamEntry = mongoose.model('TeamEntry', teamEntrySchema);

module.exports = TeamEntry;