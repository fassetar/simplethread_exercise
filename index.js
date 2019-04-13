"use strict";
/*
*@autor: Anthony Fassett
*@description: A calcuator for figuring out a clients reimbursement.
*@data: 4/13/19
*/

//dollars per day in a low cost city.
var travel_low = 45;
var travel_high = 55;
var full_low = 75;
var full_high = 85;

//NOTES: 
// 1st & n^Last = "travel"
// n = single date counted once.
// p is the next project.
// m is the number of days between projects
// (n^(n+1) == p^first) || (n == p) = "full"
// this is when m is greater than 1.
// m > 1; n^last = "travel" & p^first = "travel"
//  n^last > n < 1st = "full" == m;

var express = require('express');
var app = express();
var fs = require("fs");
var http = require('http');


app.get('/api/dates', function (req, res) {
  fs.readFile(__dirname + '/data' + ".json", 'utf8', function (err, data) {
    res.send(data);
    res.end(data);
  });
});


var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("app listening at http://127.0.0.1:%s", port);

  var request = require('request');
  request({ 
    url: 'http://127.0.0.1:8081/api/dates',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body);
      reimburseCalcuator(body);
    }
  });
});

var reimburseCalcuator = function (data) {
  data.forEach(element => {
    console.log(element);
  });
};


//Questions 
// - What if two dates of different rate
//    overlap which one rate is taken? Probably the higher one.
// - "If there is a gap between projects, then the days on
//    either side of that gap are travel days. Does that mean
//    in addition to one day or is this just first to last of a project?
