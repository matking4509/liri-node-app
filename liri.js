var dotenv = require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys =  require("./keys");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var doWhat = process.argv[2];
var doWho = process.argv[3];

if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        [doWhat, doWho] = data.split(",");
        main(doWhat, doWho);
    });
} else {
    
    main(process.argv[2], process.argv[3]);
}


function main(what, value) {
    switch (what) {
        case "concert-this":
        concertThis(value);
        break;
        
        case "spotify-this-song":
        spotifyThis(value);
        break;
        
        case "movie-this":
        movieThis(value);
        break;
        
        // case "do-what-it-says":
        //   doThis();
        //   break;
    };
};

function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
        console.log("Here is the upcoming converts for " + artist + ":");
        response.data.forEach(function(elem){
            var [date, time] = elem.datetime.split("T");
            console.log("\nWhen:\t" + date + "\n" + "Where:\t" + elem.venue.name + "\n\t" + elem.venue.city + "," + elem.venue.country);
        });
    });
};

function spotifyThis(track) {
    var limit = 1;
    if (!track) { track = "The Sign (US Album)" };
    spotify.search({ type: 'track', query: track })
        .then(function(response) {
            if (limit > 20 ) { limit = 20 };
            var items = response.tracks.items;            
            console.log("Spotify found the following track(s) that matched your search (limit " + limit + "):\n");
            for (io = 0; io < limit; io++) {
                var entryDisp = " Track: " + items[io].name;
                entryDisp += "\n Album: " + items[io].album.name;
                entryDisp += "\n Artists: ";
                for (i = io; i < items[io].artists.length; i++) {
                    entryDisp += items[io].artists[i].name;
                    if (i < items[io].artists.length-1) {
                        entryDisp += ", ";
                    }
                }
                entryDisp += "\n Preview: " + items[io].preview_url + "\n";
                console.log(entryDisp);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
};

function movieThis(title) {
    if (!title) { title = 'Mr. Nobody' };
    axios.get("https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        response = response.data;
        // console.log(response.Ratings[1]);
        console.log("\nTitle: " + response.Title + "\nYear: " + response.Year + "\nimdb Rating: " + response.imdbRating + "\nRotten Tomatoes Rating: " + response.Ratings[1].Value + "\nCountry: " + response.Country + "\nLanguage(s): " + response.Language + "\nPlot: " + response.Plot + "\nActors: " + response.Actors) + "\n";
    });
};

// * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
// * Edit the text in random.txt to test out the feature for movie-this and concert-this.

// function doThis() {
//     fs.readFile("random.txt", "utf8", function(error, data) {
//         [doWhat, doWho] = data.split(",");
//         console.log("Stuff:", doWhat, doWho);
//     });
// };
