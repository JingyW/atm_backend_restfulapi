
  bcrypt.genSalt(saltRounds, (err, salt)=>{
    bcrypt.hash(req.params.pin, salt, (err, h)=>{
      const newUser = new User({
        accountNumber: req.params.account,
        pinNumber: h,
        balance: req.params.balance
      });
      newUser.save((err, newUser)=> {
        res.json({err: err, mongooseId: newUser._id});
        return;
      });
    });
    /*
    routes.post('/friendList',(req,res)=> {
      User.findOne({facebookId:req.body.facebookId}).exec((err,found)=> {
        res.cookie('facebookId',req.body.facebookId,{domain:'.mydeseos.herokuapp.com'});
    		let promiseArr = [];
    		const mongooseidArr = req.body.friendList.split('/');
    		mongooseidArr.forEach(id=> {
    			promiseArr.push(User.findOne({facebookId:id}));
    		});
    		Promise.all(promiseArr)
    		.then((data)=> {
    			if (found === null) {
    				let friends = data.map(friend=>friend._id);
    	      const newUser = new User({
    	        username: req.body.username,
    	        facebookId: req.body.facebookId,
    					friendsList: friends
    	      });
    	      newUser.save((err, newUser)=> {
    	        res.json({err: err, mongooseId: newUser._id});
    	        return;
    	      })
    			} else {
    				found.friendsList = data.map(friend=>friend._id);
    				found.update({friendsList:found.friendsList}).exec((err,saved)=> {
    					res.json({err:err, mongooseId:found._id});
    					return;
    				})
    			}
    		})
      })
    });
    */


    routes.get('/fakedata//deposit/:balance', (req, res)=> {
      const newHistory = new History({
        type:"Deposit",
        amount:req.params.balance,
        account:req.params.account
      });
      newHistory.save((err, newHistory)=> {
        if (err) res.json({err:err});
        else {
          User.findOne({accountNumber:req.params.account}).exec((err, found)=> {
            if (err) console.log(err);
            var arr = found.history;
            arr.push(newHistory._id);
            found.history = arr;
            found.balance = found.balance+parseInt(req.params.balance);
            found.update({history:found.history, balance:found.balance}).exec((err,saved)=> {
    					res.json({err:err, mongooseId:found._id});
    					return;
    				});
          });
        }
      });
    });
