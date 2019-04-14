"use strict";
/*
*@autor: Anthony Fassett
*@description: A calcuator for figuring out a clients reimbursement.
*@data: 4/13/19
*/

var express = require('express');
var app = express();
var fs = require("fs");

app.get('/api/dates', function (req, res) {
  fs.readFile(__dirname + '/data' + ".json", 'utf8', function (err, data) {
    res.send(data);
    res.end(data);
  });
});


var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("app listening at http://127.0.0.1:%s", port);

  //Here to show how a client's data might be pulled in.
  var request = require('request');
  request({
    url: 'http://127.0.0.1:8081/api/dates',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body);
      reimburseCalcuator(body);
    } else {
      console.error("Client data not found.");
    }
  });
});


// Takes in an array of projects.
var reimburseCalcuator = function (data) {
  if (data instanceof Array) {
    console.log('value is Array!');
    //for (var i = 0; i < data.length; i++) {
    reimbursement(data[1]["Set 2"]);
    //}


  } else {
    console.error('An Array value not found.');
    return null
  }
};

function reimbursement(dates) {
  console.log(dates);
  for (var i = 0; i < dates.length; i++) {
    var item = dates[i];
    var nextDate = dates[i + 1];
    var PriceList = [];

    var firstDate = new Date(item["Start_Date"]);
    var lastDate = new Date(item["End_Date"]);

    //console.log(firstDate, lastDate, numberofDays(firstDate, lastDate));
    var ofDays = numberofDays(firstDate, lastDate);

    for (var z = 0; z < ofDays; z++) {
      PriceList.push(45); //base of travel_low

      if (z !== 0 && z + 1 !== ofDays) //Middle Days    
        PriceList[z] += 30;

      if (z === ofDays && numberofDays(lastDate, new Date(nextDate["End_Date"])) > 1) {
        console.log(numberofDays(lastDate, new Date(nextDate["End_Date"])));
        PriceList[z] += 30;
      }

      //TODO: this will take the first day and change it to full if thats the case.
      // if(z === 0 && numberofDays(firstDate, new Date(dates[i-1]["End_Date"])) > 1){
      //     PriceList[z] += 30;
      // }

      if (item["City"] === "High Cost")
        PriceList[z] += 10;
    }


    //NOTES: 
    // 1st & n^Last = "travel"
    // n = single date counted once.
    // p is the next project.
    // m is the number of days between projects
    // (n^(n+1) == p^first) || (n == p) = "full"
    // this is when m is greater than 1.
    // m > 1; n^last = "travel" & p^first = "travel"
    //  n^last > n < 1st = "full" == m;
    // if (days > 1) {
    //   return
    // }    
    console.log(PriceList, "$" + PriceList.reduce(getSum));
  }
}

function numberofDays(date1, date2) {

  // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = Math.abs(date1_ms - date2_ms);

  // Convert back to days and return
  return Math.round(difference_ms / ONE_DAY) + 1;

}

function getSum(total, num) {
  return total + num;
}