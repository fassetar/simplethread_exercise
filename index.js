"use strict";
/*jslint node: true */
/*
*@autor: Anthony Fassett
*@description: A calcuator for figuring out a clients reimbursement.
*@data: 4/13/19
*/

var express = require("express");
var app = express();
var fs = require("fs");
var request = require("request");

app.get("/api/dates", function (req, res) {
  fs.readFile(__dirname + "/data" + ".json", "utf8", function (err, data) {
    res.send(data);
    res.end(data);
  });
});


var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("app listening at http://127.0.0.1:%s", port);

  //Here to show how a client's data might be pulled in.
  request({
    url: "http://127.0.0.1:8081/api/dates",
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
    console.log("value is Array!");
    for (var i = 0; i < data.length; i++) {
      var tmp = "Set " + (i + 1);
      console.log(tmp);
      reimbursement(data[i][tmp]);
    }
  } else {
    console.error("An Array value not found.");
    return null;
  }
};

function reimbursement(dates) {
  console.log(dates);
  for (var i = 0; i < dates.length; i++) {
    var item = dates[i];
    var nextDate = dates[i + 1];
    var PriceList = [];
    var Overlaps = [];
    var firstDate = new Date(item["Start_Date"]);
    var lastDate = new Date(item["End_Date"]);

    //console.log(firstDate, lastDate, numberofDays(firstDate, lastDate));
    var ofDays = numberofDays(firstDate, lastDate);

    for (var z = 0; z < ofDays; z++) {

      PriceList.push(45); //base of travel_low

      if (item["City"] === "High Cost")
        PriceList[z] += 10;

      if (z !== 0 && z + 1 !== ofDays) {//Middle Days    
        PriceList[z] += 30;
      } else if (z === 0 && i !== 0) { //Case of a full day - first days going backwards
        console.log(dates[i - 1]["End_Date"], numberofDays(firstDate, new Date(dates[i - 1]["End_Date"])));
        if (numberofDays(firstDate, new Date(dates[i - 1]["End_Date"])) <= 2) {
          PriceList[z] += 30;
        }
        //Dup case collection.
        if (numberofDays(firstDate, new Date(dates[i - 1]["End_Date"])) == 1) {
          Overlaps.push(z);
        }
      } else if (i + 1 !== dates.length && z + 1 === ofDays) {
        //Case of a full day - last days going forward        
        if (numberofDays(lastDate, new Date(nextDate["Start_Date"])) <= 2)
          PriceList[z] += 30;
      }

    }
    reduceOverlaps(Overlaps, PriceList);
    if (PriceList.length != 0) {
      console.log(PriceList, "$" + PriceList.reduce(getSum));
    } else {
      console.log(PriceList, "$0");
    }
  }
}

function reduceOverlaps(overlaps, prices) {
  overlaps.forEach(element => {
    prices.splice(element, 1);
  });
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