'use strict'
const express = require('express') // require the express package
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
// copy .env 
const PORT=process.env.PORT;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Cocktail', {useNewUrlParser: true, useUnifiedTopology: true});

//schema 
const CocktailSchema = new mongoose.Schema({
    name: String,
    img:String,
    id:String
  });
  const CocktailModel = mongoose.model('Cocktail', CocktailSchema);

//Routes
app.get('/all',datahandler); 
app.post('/addFav',addFavdatahandler);
app.get('/getFav',getFavhandler);
app.delete('/deleteFav',deleteFavhandler);
app.put('/updateDate',updateDatahandler);



function updateDatahandler(req,res){
 
    console.log(req.body);
    const {name,img,id}=req.body;
    console.log(id);
    CocktailModel.find({_id:id},(err,data)=> {
    
        data[0].name=name; 
        data[0].img=img;
        data[0].save()
        .then(()=>{
            CocktailModel.find({},(err,data)=> {
                res.send(data)});
            });
        })
        
    }

function addFavdatahandler(req,res){
    
  console.log(req.body);
  const {name,img,id}=req.body;
  const item=new CocktailModel({
      name:name,
      img:img,
      id:id,
  });
  item.save(); 

    
}

function datahandler(req,res){

    const url =`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
    axios.get(url)
    .then(results=> {
    res.send(results.data.drinks)
    console.log(results.data.drinks);
    })
}
function getFavhandler(req,res){
    CocktailModel.find({},(err,data)=> {
        res.send(data);
    });
}

function deleteFavhandler(req,res){
const id=req.query.id;
console.log(id)
CocktailModel.deleteOne({_id:id}, (err,data)=>{
    CocktailModel.find({},(err,data)=> {
        res.send(data);
    });
})
   
}
deleteFavhandler
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
