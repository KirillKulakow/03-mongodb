const { UserModel } = require('../database');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, config.secretKey)._id;
      } catch (err) {
        next(res.status(401).send({"message": "Not authorized"}));
      }
      const user = await UserModel.findById(
        userId
      );
      if (!user) {
        next(res.status(401).send({"message": "Not authorized"}));
      }
  
      req.user = user;
      req.token = token;
  
      next();
    } catch (err) {
        console.error("INPUT", req.params, req.query, req.body);
        console.error("---------------------------------------");
        console.error(err);
        console.error("=======================================");
        
        res.status(500).send({ "message": err.message });
    }
  }

exports.Authorize = authorize;