const mongoose = require('mongoose');

const playerPerformanceSchema = mongoose.Schema({
    playerName:{
        type:String,
        required:true
    },
    runs:{
        type:Number,
        default: 0,
    },sixes:{
        type:Number,
        default:0,
    },
    boundary:{
        type:Number,
        default: 0,
    },
    isOut:{
        type:Boolean,
        default: false,
    },
    wickets:{
        type:Number,
        default: 0,
    },
    LBW:{
        type:Number,
        default:0,
    },
    maidanOver:{
        type:Number,
        default:0
    },
    catch:{
        type:Number,
        default:0,
    },
    stumping:{
        type:Number,
        default:0,
    },
    runOut:{
        type:Number,
        default:0,
    },
    totalPoints:{
        type:Number,
        default:0
    }
});

const PlayerPerformance = mongoose.model('PlayerPerformance',playerPerformanceSchema);

module.exports = PlayerPerformance;