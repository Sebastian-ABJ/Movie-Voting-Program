const express = require('express');
const request = require("request");
var path = require('path');
//Must be node-fetch v2
var fetch = require('node-fetch');
const oscarData = require('./oscar_data.json');
var htmlData = __dirname + '/html/';   //__dirname : It will resolve to your project folder.

//This will handle changes to the url.
var appRouter = function (app) {

  app.get('/',function(req,res){        // Use this syntax to handle redirects to other areas (Not super important but makes you feel smart)
    res.redirect('home');              // Note how you don't need to show the desired file, just change the url
  });

  app.get('/home',function(req,res){                    // Use this syntax for showing an html file as a web page.      
    res.sendFile(path.join(htmlData + 'index.html'));     // Note that all you need to change is the first argument of the .get()
  });                                                     // and the last argument of the .join()

  app.get('/results',function(req,res){
    res.sendFile(path.join(htmlData + 'results.html'));
    
  });

  //Testing API call...ask Sebastian for clarification
  app.get("/api", async function(req, res) {
    console.log("/API root reached. Redirecting for testing...");
    res.redirect('/api/search?movieID=550');
    /* let api_url = "https://api.themoviedb.org/3/movie/550?api_key=6221e0ed54d6b02887581e40fa35381a";    //May want to store API key in hidden file for security
    let json = null;                                                                                    //Not sure why this variable is even used
    const data = await fetch(api_url)                                                               //The glorious fetch()
      .then((data) => json = data.json())                                                       //Parse result into json (probably not needed)
      .catch((err) => console.log(err));                                                                //Output error if one occurs
    console.log(json);                                                                                  //Output json data to console (probably not needed)
    res.json(data); */                                                                              //Response of this API call
  });

  //Testing API call constructing using parameters...a work in progress
  app.get("/api/search/movie/:movie", async function(req, res) {
    let base = "https://api.themoviedb.org/3/movie/";    
    let key = "?api_key=6221e0ed54d6b02887581e40fa35381a"; // '?' needed for the API query syntax
    let movie = req.params.movie;
    console.log(movie);
    let api_url = base + movie + key;
    let json = null;

    console.log("Attempting API call for movie ID: " + movie);
    let data = await fetch(api_url)
      .then((data) => {
        console.log("success!");
        return json = data.json();
      })
      .catch((err) => console.log(err))
    res.json(data);
  });

  app.get("/api/search/category/:category", getGenreList);



  //Not sure exactly what this does but it makes CSS work
    //Apparently this needs to be after redirect calls. So keep this at the bottom of the function...
  app.use(express.static('html'));
  }
  
module.exports = appRouter;

async function getGenreList(req, res) {
    console.log(req);
    const film = "film";
    const name = "name";
    const year = "year_film";
    const winner = "winner";

    var category = ((req.params.category).toString()).toUpperCase();
    var json = {};


    console.log("Requested category: " + category);

    for(var i = (oscarData.length - 1); i >= 0 ; i--) {
      if(oscarData[i].category == category) {
        var movie = oscarData[i];
        var title = movie.film;
        var nomineeName = movie.name;
        var releaseYear = movie.year_film;
        var awardCategory = movie.category;
        var awardWinner = movie.winner;
        console.log("Adding movie: " + title);
        json[title] = 
          {
            "title": title,
            "year": releaseYear,
            "name": nomineeName,
            "category": awardCategory,
            "winner": awardWinner
          };
      }
    }
    res.json(json);
}