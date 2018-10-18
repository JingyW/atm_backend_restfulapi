const express = require('express');
const models = require('../models/models');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = models.User;
const History = models.History;
const routes = express();

routes.post('/login', (req,res)=> {
  console.log("In login")
  User.findOne({accountNumber:req.body.account}).exec((err, foundUser)=> {
    if (err) {
      console.log(err);
      return;
    }
    if (!foundUser) {
      res.send({err:"Account doesn't exist."});
    } else {
      bcrypt.compare(req.body.pin, foundUser.pinNumber, function(err, respond) {
        if (respond) {
          res.json({success:true});
        } else {
          res.json({err:"Pin Number does not match."});
        }
      });
    }
  })
});

routes.post('/balanceinfo',(req,res)=> {
  User.findOne({accountNumber: req.body.account}).exec((err, foundUser)=> {
    if (err) {
      console.log(err);
      return;
    }
    if (!foundUser) {
      res.send("userid not found");
    } else {
      res.json({amount:foundUser.balance});
    }
  })
});

routes.post('/deposit',(req,res)=> {
  const newHistory = new History({
    type:"Deposit",
    amount:req.body.amount,
    account:req.body.account
  });
  newHistory.save((err, newHistory)=> {
    if (err) res.send({err:err});
    else {
      User.findOne({accountNumber:req.body.account}).exec((err, found)=> {
        if (err) {
          res.json({err:err});
          return;
        }
        var arr = found.history;
        arr.push(newHistory._id);
        found.history = arr;
        found.balance = found.balance+parseInt(req.body.amount);
        found.update({history:found.history, balance:found.balance}).exec((err,saved)=> {
					if (err) {
            res.json({success:false});
          } else {
            res.json({success:true});
          }
				});
      });
    }
  });
});

routes.post('/withdraw', (req,res)=> {
  User.findOne({accountNumber:req.body.account}).exec((err, found)=> {
    if (err) res.send({err:err});
    if (found.balance < req.body.amount) {
      res.send({err: "Not enough balance!"});
      return;
    }
    const newHistory = new History({
      type:"Withdraw",
      amount:req.body.amount,
      account:req.body.account
    });
    newHistory.save((err, newHistory)=> {
      if (err) res.json({err:err});
      else {
        var arr = found.history;
        arr.push(newHistory._id);
        found.history = arr;
        found.balance = found.balance-parseInt(req.body.amount);
        found.update({history:found.history, balance:found.balance}).exec((err,saved)=> {
					if (err) {res.send({success:false});}
          else {res.send({success:true});}
				});
      }
    });
  });
});

routes.post('/transaction',(req,res)=> {
  User.findOne({accountNumber:req.body.toaccount}).exec((err, tofound)=> {
    if (err) res.send({err:"nouser"});
    else {
      const newHistory = new History({
        type:"Transaction",
        amount:req.body.amount,
        account:req.body.toaccount
      });
      newHistory.save((err, newHistory)=> {
        if (err) res.send({err:err});
        else {
          var arr = tofound.history;
          arr.push(newHistory._id);
          tofound.history = arr;
          tofound.balance = tofound.balance+parseInt(req.body.amount);
          tofound.update({history:tofound.history, balance:tofound.balance}).exec((err,saved)=> {
  					if (err) {res.send({success:false});}
            else {res.send({success:true});}
  				});
        }
      });
    }
  });
  const newHistory = new History({
    type:"Transaction",
    amount:-req.body.amount,
    account:req.body.account
  });
  newHistory.save((err, newHistory)=> {
    if (err) res.send({err:err});
    else {
      User.findOne({accountNumber:req.body.account}).exec((err, found)=> {
        if (err) console.log(err);
        var arr = found.history;
        arr.push(newHistory._id);
        found.history = arr;
        found.balance = found.balance+parseInt(req.body.amount);
        found.update({history:found.history, balance:found.balance}).exec((err,saved)=> {
					if (err) {res.send({success:false})}
          else {res.send({success:true});}
				});
      });
    }
  });
});

routes.post('/history',(req,res)=> {
  User.findOne({accountNumber:req.body.account}).exec((err,found)=> {
    let promiseArr = [];
    const mongooseidArr = found.history;
    mongooseidArr.forEach(id=> {
      promiseArr.push(History.findById(id));
    });
    Promise.all(promiseArr)
    .then((data)=> {
      if (data === null) {
        res.json({empty:true});
      } else {
        res.json({data:data});
      }
    })
  })
});

module.exports = routes;
