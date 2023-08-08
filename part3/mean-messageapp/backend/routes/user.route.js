const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcrypt');
const AES = require('crypto-js/aes');

let User = require('../models/User');
const Log = require('../models/Log');
let Token = require('../service/Tokenservice');
let TokenStorage = require('../service/TokenStorage');

tokenservice = new Token('yildirimozen565261526152615261526512');

userRoute.route('/login').post((req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return next(err);
        }
        if (isMatch) {
          const logoutLog = new Log({
            username: username, 
            action: 'login',
            date: new Date()
          });
          logoutLog.save()
          const generatedToken = tokenservice.generateToken({ username: user.username, isAdmin: user.isAdmin });
          TokenStorage.addToken(generatedToken);
          res.json({ token: `${generatedToken}` });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

userRoute.route('/logout').post((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
  const logoutLog = new Log({
    username: decoded.username, 
    action: 'logout',
    date: new Date()
  });
  logoutLog.save()
    .then(() => {
      TokenStorage.removeToken(token);
      res.json({ message: 'You have been successfully logged out' });
    })
    .catch(error => {
      return next(error);
    });
});

userRoute.route('/adduser').post((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(decoded.isAdmin == false){
      return res.status(401).json({ message: 'You are not admin' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'adduser ' + req.body.username,
      date: new Date()
    });
    logoutLog.save()
    const secretKey = 'yildirim';
    const decryptedBytes = AES.decrypt(req.body.password, secretKey);
    const decryptedPassword = decryptedBytes.toString(AES.Utf8);
    const userData = { ...req.body, password: decryptedPassword};
    User.create(userData)
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        return next(error);
      });
});

userRoute.route('/updateuser').put((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(decoded.isAdmin == false){
      return res.status(401).json({ message: 'You are not admin' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'updateuser ' + req.body.username,
      date: new Date()
    });
    logoutLog.save()
    const filter = { username: req.body.username };
  User.findOneAndUpdate(filter, req.body, { new: true })
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    return next(error);
  });
});

userRoute.route('/deleteuser/:id').delete((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(decoded.isAdmin == false){
      return res.status(401).json({ message: 'You are not admin' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'deleteuser ' + req.params.id,
      date: new Date()
    });
    logoutLog.save()
    User.findByIdAndRemove(req.params.id)
    .then(data => {
      if (!data) {
        throw createError(404, 'Data not found');
      }
      res.status(200).json({
        msg: data
      });
    })
    .catch(error => {
      return next(error);
    });
});

userRoute.route('/listusers').get((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(decoded.isAdmin == false){
      return res.status(401).json({ message: 'You are not admin' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'listusers',
      date: new Date()
    });
    logoutLog.save()
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    User.find()
    .then(data => {
      numOfPages = Math.ceil(data.length/pageSize);
      res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
    })
    .catch(error => {
      return next(error);
    });
});

userRoute.route('/getusernames').get((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'getusernames',
      date: new Date()
    });
    logoutLog.save()
    User.find({}, {username : 1})
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      return next(error);
    });
});

userRoute.route('/getuser/:username').get((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(decoded.isAdmin == false){
      return res.status(401).json({ message: 'You are not admin' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'getuser ' + req.params.username,
      date: new Date()
    });
    logoutLog.save()
    User.find({username : req.params.username})
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      return next(error);
    });
});

userRoute.route('/sortusers').get((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'sortusers',
      date: new Date()
    });
    logoutLog.save()

    const username = decoded.username; 
    const sortType = req.query.sortOption;
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    if(sortType == 'birthday'){
      User.find().sort({ Birthday: -1 }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }else if(sortType == 'name'){
      User.find().sort({ username: 1 }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }else if(sortType == 'surname'){
      User.find().sort({ surname: 1 }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }else{
      User.find().sort({ username: 1 }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }});

userRoute.route('/searchusers').get((req, res, next) => {
  const token = req.headers.authorization;
  decoded = tokenservice.verifyToken(token);
    if (decoded == null) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if(TokenStorage.findInTokens(token) == false){
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const logoutLog = new Log({
      username: decoded.username, 
      action: 'searchusers',
      date: new Date()
    });
    logoutLog.save()

    const username = decoded.username; 
    const query = req.query.search;
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    User.find({ username: { $regex: query, $options: "i" } }).then((data) => {
      numOfPages = Math.ceil(data.length/pageSize);
      res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
    })
      .catch((error) => {
        return next(error);
      });
});

module.exports = userRoute;