const mongoose =require("mongoose");

function connectDB(){

    mongoose.connect('mongodb+srv://Advait:Advait@cluster0.3vk2dig.mongodb.net/CarORent', {useUnifiedTopology:true ,useNewUrlParser:true})

    const connection=mongoose.connection

    connection.on('connected',()=>{
        console.log('Mongo Db connection Succefull')
    })

    connection.on('error',()=>{
        console.log('Mongo DB connection failed')
    })

}

connectDB()

module.exports=mongoose
