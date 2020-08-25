const express = require('express');
const { UserModel } = require('../database');
const { Authorize } = require('../middlewares/authorize');
const userValidation = require('../middlewares/userValid');
const { generateAvatar, minifyImage } = require('../services/generateAvatar');
const uuid = require('uuid').v4;
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({email: email});
      console.log(path.dirname(__dirname))
      if (!user){
        return res.status(401).send("Email or password is wrong")
      }
      const match = await UserModel.isPasswordValid(password, user.password);
      if (!match){
        return res.status(401).send("Email or password is wrong")
      }
      const token = await UserModel.generateToken(user._id);
        res.status(200).send({token: token, user: {email: user.email, subscription: user.subscription}})
    } catch (e) {
      if (e.errors) {
          res.status(400).send(e.message)
      }
      console.log(e);
      res.status(500).send(e);
    }
});

router.post('/logout', Authorize, async (req, res) => {
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");
  console.log(token);
  await UserModel.decodeToken(token);
  res.sendStatus(204)
});


router.post('/register', (req, res, next) => userValidation(req, res, next), async (req, res) => {
  try {
    const { email, password, subscription } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarName = uuid();
    await generateAvatar(avatarName);
    const avatarFullName = `${avatarName}.png`;
    const avatarUrl = await minifyImage(avatarFullName);
    console.info(avatarUrl);
    const user = await UserModel.create({ email: email, password: hashPassword, subscription: subscription, avatarURL: avatarUrl});
    res.status(201).send({user: {email, subscription: subscription ? subscription : "free"}});
  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
        return res.status(409).send('Email in use');
    };
    if (e.message.includes("validation")) {
        res.status(400).send({message: e.message})
    }
    console.error(e);
    res.status(500).send(e);
  }
});

exports.AuthRouter = router;
