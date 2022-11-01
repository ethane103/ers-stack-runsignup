const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
const fetch = require('electron-fetch').default
const { channels } = require('../shared/constants');


const secret = "yZfkZdIlrpwhmd9IHwMcX3MBMyjkdVGe"
const apikey = "llq6HUNrfmBZa3VkQdAKNHS0eUZ1EFij"
var raceData = [];
var eventData = [];
var resultData = [];

function initDB() {

  const sqlite3 = require('sqlite3').verbose();

  let database = new sqlite3.Database('./public/db.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err){
          return console.error(err.message);
      }
  }); 

  return database;

}

function populate(insertionQuery, array, db) {

  let statement = db.prepare(insertionQuery)

  for (var i = 0; i < array.length; i++) 
  {
      statement.run(array[i], function (err) { 
          if (err) throw err;
      });
  }

}


function getRacesAndEvents(user) {

  // can display id's for 50 races, 10 for testing purposes
  for (let i = 0; i < 10; i++) {
    raceObject = user.races[i];
    raceData[i] = [raceObject.race.race_id, raceObject.race.name]
    // console.log(i + "  \nRace ID: " + raceObject.race.race_id, raceObject.race.name);
    
    // some races have multiple events, group race id and their event id's together
    // concatenating into string for console printing purposes, event id is an integer
    for(let j = 0; raceObject.race.events[j] != null; j++) {
        eventData.push([raceObject.race.race_id, raceObject.race.events[j].event_id , raceObject.race.events[j].name]);
    }
        
  
  }

}

function processRacesAndEvents() {
    fetch('https://runsignup.com/Rest/races?api_key=' + apikey + ' &api_secret=' + secret + '&format=json&events=T&race_headings=F&race_links=F&include_waiver=F&include_multiple_waivers=F&include_event_days=F&include_extra_date_info=F&page=1&results_per_page=50&sort=name+ASC&start_date=today&only_partner_races=F&search_start_date_only=F&only_races_with_results=T&distance_units=K')
    .then(response => {
      return response.json();
    })
    .then(user => {
  
      getRacesAndEvents(user);
      const sqlite3 = require('sqlite3').verbose();
  
      let db = initDB();
    
      // create the statement for the insertion of just ONE record
      let insertionQuery = 
        "INSERT INTO Event (race_id, event_id, event_name) " +
        "VALUES (?, ?, ?)"; 
  
      
     
      populate(insertionQuery, eventData, db);
  
      let insertionQuery2 =    
      "INSERT INTO Races (race_id, race_name) " +
      "VALUES (?, ?)"; 
  
      populate(insertionQuery2, raceData, db);
  
      db.close;
  
    });

}
function resetDB() {

    const sqlite3 = require('sqlite3').verbose();
  
    let db = new sqlite3.Database('./public/db.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err){
            return console.error(err.message);
        }
    }); 
  
    db.run('DELETE from Races');
    db.run('DELETE from Event');
    db.run('DELETE from Racers_Result');
  
    db.close;
  
  }

const database = initDB();
const map = new Map();


function DataExt(db, callback) {
    db.all('SELECT event_id, race_id FROM Event',(err,rows)=>{
        if(err){
            return console.error(err.message);
        }
        else
        {           
            rows.forEach((row)=>{
                map.set(row.event_id, row.race_id);
             });
            
            return callback(false, map);
              
        }

    });
}

ipcMain.on(channels.ASYNC_MESSAGE, (event, arg) => {
    const sql = arg;
    database.all(sql, (err, rows) => {
        event.reply(channels.ASYNC_REPLY, (err && err.message) || rows);
    });
});

ipcMain.on(channels.GET_DATA, (event, arg) => {
    processRacesAndEvents();
    console.log("Races & Events Populated");
});

ipcMain.on(channels.RESET_DB, (event, arg) => {
    resetDB();
    console.log("Database Reset");
});

ipcMain.on(channels.FILL_MAP, (event, arg) => {
    DataExt(database, function(err, content) {
        if(err) throw(err);
        ExtractedHostnames = map;
        //console.log("Events: ", ExtractedHostnames);
    
        for (const [key, value] of map.entries()) {
            console.log(key + ": " + value)
        }
    })    
    console.log("Map filled")
});
