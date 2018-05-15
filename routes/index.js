var express = require('express');
var router = express.Router();
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');
var user = require('../config/user');
var information = require('../config/information');
var sendEmail = require('../routes/email');

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  if (req.query.user === undefined) {
    res.render('index', {
      "title": 'Jane & Chris',
      "informationlist" : information.informationItems,
      "user" : user
    });
  } else {
    collection.findOne({"userid" : parseInt(req.query.user)}, function(err, result) {
      var setResult = result === null ? user : result;
      if (err) throw err;
      res.render('index', {
          "title": "Jane & Chris",
          "informationlist" : information.informationItems,
          "user" : setResult
      });
    });
  }
});

/* POST home page. */
router.post('/',[
  sanitizeBody('adults').toFloat(),
  sanitizeBody('children').toFloat(),
  sanitizeBody('user').toFloat(),
  sanitizeBody('guestname').trim(),
  sanitizeBody('attending').escape()
], function(req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return
  }

  var db = req.db;
  var collection = db.get('usercollection');

  var attending = req.body.attending === 'on' ? true : false;

  if (req.body.user === undefined) {
    res.render('index', {
      "title": 'Jane & Chris',
      "informationlist" : information.informationItems,
      "user" : user
    });
  } else {
    collection.update({"userid" : parseInt(req.body.user)}, {
      $set : {
        adults: req.body.adults,
        children: req.body.children,
        attending: attending,
        rsvp: true,
      }
    }).then(function(err, result) {
      var setText = attending ? "<h1>"+req.body.guestname+"</h1><br /><p>"+req.body.adults+" adults, "+req.body.children+" children are attending</p>" : "<h1>"+req.body.guestname+"</h1><br /><p>Won't be attending</p>";
      sendEmail(setText);
      collection.findOne({"userid" : parseInt(req.body.user)}, function(err, result) {
        var setResult = result === null ? user : result;
        if (err) throw err;
        res.render('index', {
            "title": "Jane & Chris",
            "informationlist" : information.informationItems,
            "user" : setResult
        });
      });
    });
  }
});


module.exports = router;
