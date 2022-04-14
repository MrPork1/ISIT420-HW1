let x = 2;
var express = require('express');
var router = express.Router();
var fs = require("fs");

const mongoose = require("mongoose");

const OrderSchema = require("../orderSchema");

const dbURI = "mongodb+srv://ironman:jarvas@seank-cluster.i2vdg.mongodb.net/Orders?retryWrites=true&w=majority";

mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
}

mongoose.connect(dbURI, options).then(
 () => {
   console.log("Database connection made.");
 },
 err => {
   console.log("Error connecting to DB", err);
 }
);

// start by creating data so we don't have to type it in each time
let ServerSalesArray = [];

// define a constructor to create movie objects
let MovieObject = function (pTitle, pYear, pGenre, pMan, pWoman, pURL) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Title = pTitle;
    this.Year = pYear;
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
}

let SalesObject = function(pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
  this.StoreID = storeIDArray[Math.floor(Math.random()* storeIDArray.length)];
  let newArray = dict[this.StoreID];
  this.SalesPersonID = newArray[Math.floor(Math.random()* newArray.length)];
  this.CdID = cdID[Math.floor(Math.random() * cdID.length)];
  this.PricePaid = Math.floor(Math.random() * (15 - 5 + 1) + 5);
  let d = new Date();
  d.toDateString();
  this.Date = d;
}

// my file management code, embedded in an object
fileManager  = {

  // this will read a file and put the data in our movie array
  // NOTE: both read and write files are synchonous, we really can't do anything
  // useful until they are done.  If they were async, we would have to use call backs.
  // functions really should take in the name of a file to be more generally useful
  read: function() {
    // has extra code to add 4 movies if and only if the file is empty
    const stat = fs.statSync('salesData.json');
    if (stat.size !== 0) {                           
    var rawdata = fs.readFileSync('salesData.json'); // read disk file
    ServerSalesArray = JSON.parse(rawdata);  // turn the file data into JSON format and overwrite our array
    }
    else {
      // make up 3 for testing
      //ServerSalesArray.push(new SalesObject());
      // ServerMovieArray.push(new MovieObject("Wild At Heart", 1982, "Drama"));
      // ServerMovieArray.push(new MovieObject("Raising Arizona", 1983, "Comedy"));
      // ServerMovieArray.push(new MovieObject("USS Indianapolis", 2016, "Drama"));
      //fileManager.write();
    }
  },
  
  write: function() {
    let data = JSON.stringify(ServerSalesArray);    // take our object data and make it writeable
    fs.writeFileSync('salesData.json', data);  // write it
  },
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Movie data */
router.get('/getAllSales', function(req, res) {
  fileManager.read();
  res.status(200).json(ServerSalesArray);
});

router.get('/getQueryOne', function(req, res) {
  let which = "drama";
  OrderSchema.find({ Genre: which, Year: {$gt: 1971, $lt: 1996 } }.sort({Year: -1}).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  }));
});

router.get('/sum', function(req,res) {
  OrderSchema.aggregate(
    [
      {
        $group: {
          _id: "$SalesPersonID",
          total: {
            $sum: "$PricePaid"
          }
        }
      }
    ],
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
        console.log(result);
      }
    }
  );
});



/* Add one new Movie */
router.post('/AddSales', function(req, res) {
  let oneNewOrder = new OrderSchema(req.body);
  oneNewOrder.save((err, todo) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      var response = {
        status : 200,
        success : 'Added Successfully'
      }
      res.end(JSON.stringify(response));
      }
    });
  });

// delete movie

router.delete('/DeleteSales/:ID', (req, res) => {
  const ID = req.params.ID;
  let found = false;
  console.log(ID);    

  for(var i = 0; i < ServernewSalesArray.length; i++) // find the match
  {
      if(ServernewSalesArray[i].ID === ID){
        ServernewSalesArray.splice(i,1);  // remove object from array
          found = true;
          fileManager.write();
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
    var response = {
      status  : 200,
      success : 'Order ' + ID + ' deleted!'
    }
    res.end(JSON.stringify(response)); // send reply
  }
});


module.exports = router;
