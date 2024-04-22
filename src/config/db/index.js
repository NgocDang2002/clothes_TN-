const mongoose = require('mongoose');

async function connect(){
    
    try{
        // await mongoose.connect(`mongodb://localhost:27017/clothes_TND/${database}`);
        await mongoose.connect(`mongodb://localhost:27017/clothes_TND`);
        console.log('Connect successfully MongDB!!!');
    }catch(erro){
        console.log('Connect ERROR MongDB!!!');
    }

}

module.exports = { connect };
