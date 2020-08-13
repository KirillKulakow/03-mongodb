const express = require('express');
const { UserModel } = require('../database');
const { Authorize } = require('../middlewares/authorize');
const { compareSync } = require('bcrypt');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({email: email});
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


router.post('/register', async (req, res) => {
  try {
    const { email, password, subscription } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email: email, password: hashPassword, subscription: subscription });
    res.status(201).send({user: {email, subscription: subscription ? subscription : "free"}});
  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
        return res.status(409).send('Email in use');
    };
    if (e.errors.email) {
        res.status(400).send(e.message)
    }
    console.error(e);
    res.status(500).send(e);
  }
});

exports.AuthRouter = router;
