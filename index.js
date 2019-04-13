/*
*@autor: Anthony Fassett
*@description: A calcuator for figuring out a clients reimbursement.
*@data: 4/13/19
*/

//dollars per day in a low cost city.
travel_low = 45;
travel_high = 55;
full_low = 75;
full_high = 85;

//NOTES: 
// 1st & n^Last = "travel"
// n = single date counted once.
// p is the next project.
// m is the number of days between projects
// (n^(n+1) == p^first) || (n == p) = "full"
// this is when m is greater than 1.
// m > 1 n^last = "travel" & p^first = "travel"
//  n^last > n < 1st = "full" == m;

const express = require('express');
const app = express();
const fs = require("fs");


app.get('/api/dates', (req, res) => {

   fs.readFile( __dirname +'/data' +".json", 'utf8', function (err, data) {
       res.send(data);
       res.end( data );
   });

});


var server = app.listen(8081, () => {
  var port = server.address().port
  console.log("Example app listening at http://127.0.0.1:%s", port)
});



//Questions 
// - What if two dates of different rate
//    overlap which one rate is taken? Probably the higher one.
// - "If there is a gap between projects, then the days on
//    either side of that gap are travel days. Does that mean
//    in addition one day is included for the travel days or 
//    is this just first to last of a project?
