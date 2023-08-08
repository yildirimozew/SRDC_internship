const express = require('express');
const messageRoute = express.Router();

let Message = require('../models/Message');
let User = require('../models/User');
let TokenStorage = require('../service/TokenStorage');
const Log = require('../models/Log');


messageRoute.route('/sendmsg').post((req, res, next) => {
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
      action: 'sendmsg to ' + req.body.receiver,
      date: new Date()
    });
    logoutLog.save()

    const sender_username = decoded.username; 

    User.findOne({ username: req.body.receiver })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        const messageData = { ...req.body, Date: new Date(), deleted_sender: false, deleted_receiver: false, sender: sender_username };
  
        Message.create(messageData)
          .then(data => {
            res.json(data);
          })
          .catch(error => {
            return next(error);
          });
      })
      .catch((error) => {
        return next(error);
      });
});



messageRoute.route('/inbox').get((req, res, next) => {
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
      action: 'inbox',
      date: new Date()
    });
    logoutLog.save()

    const receiver = decoded.username; 

    User.findOne({ username: receiver })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        const PAGE_SIZE = 3;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
        const startIndex = (page - 1) * pageSize;
        Message.find({ receiver: receiver, deleted_receiver: false }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
        /*Message.find({ receiver: receiver, deleted_receiver: false }).skip(startIndex).limit(pageSize)
          .then((data) => {
            res.json(data);
          })
          .catch((error) => {
            return next(error);
          });*/
      })
      .catch((error) => {
        return next(error);
      });
});

messageRoute.route('/outbox').get((req, res, next) => {
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
      action: 'outbox',
      date: new Date()
    });
    logoutLog.save()

    const sender = decoded.username; 

    User.findOne({ username: sender })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        const PAGE_SIZE = 3;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
        const startIndex = (page - 1) * pageSize;

        Message.find({ sender: sender, deleted_sender: false }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
          .catch((error) => {
            return next(error);
          });
      })
      .catch((error) => {
        return next(error);
      });
});

messageRoute.route('/deletemsg/:id').delete((req, res, next) => {
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
      action: 'deletemsg ' + req.params.id,
      date: new Date()
    });
    logoutLog.save()

    const username = decoded.username; 
    flag = false;

    Message.findById(req.params.id)
      .then(message => {
        if (!message) {
          return res.status(401).json({ message: 'Message not found' });
        }

        if (message.sender == username) {
          message.deleted_sender = true;
          flag = true;
        } 
        if (message.receiver == username) {
          message.deleted_receiver = true;
          flag = true;
        } 
        if(flag == false) {
          return res.status(403).json({ message: 'Unauthorized to delete this message' });
        }

        message.save()
          .then(savedMessage => {
            res.status(200).json({ message: 'Message deleted successfully' });
          })
          .catch(error => {
            return next(error);
          });
  });
});

messageRoute.route('/search').get((req, res, next) => {
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
      action: 'search',
      date: new Date()
    });
    logoutLog.save()

    const username = decoded.username; 
    const query = req.query.search;
    const inboxActive = req.query.inboxActive;
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    if(inboxActive == 'true'){
      Message.find({ receiver: username, deleted_receiver: false, title: { $regex: query, $options: "i" } }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }else{
      Message.find({ sender: username, deleted_sender: false, title: { $regex: query, $options: "i" } }).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    }
});

messageRoute.route('/sortlist').get((req, res, next) => {
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
      action: 'sort',
      date: new Date()
    });
    logoutLog.save()

    const username = decoded.username; 
    const sortType = req.query.sortOption;
    const inboxActive = req.query.inboxActive;
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    if(inboxActive == 'true'){
      if(sortType == 'date'){
        Message.find({ receiver: username, deleted_receiver: false }).sort({ date: -1 }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
          .catch((error) => {
            return next(error);
          });
      }else{
        Message.find({ receiver: username, deleted_receiver: false }).sort({ title: 1 }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
          .catch((error) => {
            return next(error);
          });
      }
    }else{
      if(sortType == 'date'){
        Message.find({ sender: username, deleted_sender: false }).sort({ date: -1 }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        }
          )
          .catch((error) => {
            return next(error);
          });
      }else{
        Message.find({ sender: username, deleted_sender: false }).sort({ title: 1 }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
          .catch((error) => {
            return next(error);
          });
      }}});

  messageRoute.route('/logs').get((req, res, next) => {
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
        action: 'logs',
        date: new Date()
      });
      logoutLog.save();
      const PAGE_SIZE = 3;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
        const startIndex = (page - 1) * pageSize;
      Log.find({}).then((data) => {
        numOfPages = Math.ceil(data.length/pageSize);
        res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
      })
        .catch((error) => {
          return next(error);
        });
    });

    messageRoute.route('/sortlogs').get((req, res, next) => {
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
          action: 'sortlogs',
          date: new Date()
        });
        logoutLog.save()
        const PAGE_SIZE = 3;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
        const startIndex = (page - 1) * pageSize;
        const sortType = req.query.sortOption;
        if(sortType == 'date'){
          Log.find({}).sort({ date: -1 }).then((data) => {
            numOfPages = Math.ceil(data.length/pageSize);
            res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
          })
            .catch((error) => {
              return next(error);
            });
        }else if(sortType == 'username'){
          Log.find({}).sort({ username: 1 }).then((data) => {
            numOfPages = Math.ceil(data.length/pageSize);
            res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
          })
            .catch((error) => {
              return next(error);
            });
        }else{
          Log.find({}).sort({ action: 1 }).then((data) => {
            numOfPages = Math.ceil(data.length/pageSize);
            res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
          })
            .catch((error) => {
              return next(error);
            });
        }
      });

  messageRoute.route('/searchlogs').get((req, res, next) => {
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
        action: 'searchlogs',
        date: new Date()
      });
      logoutLog.save()
      const PAGE_SIZE = 3;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || PAGE_SIZE;
        const startIndex = (page - 1) * pageSize;
        const query = req.query.search;
        Log.find({ username: { $regex: query, $options: "i" } }).then((data) => {
          numOfPages = Math.ceil(data.length/pageSize);
          res.json({data: data.slice(startIndex, startIndex + pageSize), numOfPages: numOfPages});
        })
          .catch((error) => {
            return next(error);
          });
      });
    

module.exports = messageRoute;