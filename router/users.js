const express = require('express');
const { UserModel } = require('../database');
const router = express.Router();

router.get('/current', (req, res) => {
    res.status(200).send({email: req.user.email, subscription: req.user.subscription})
});

router.patch('/', async (req, res) => {
    try {
        const { body: {sub} } = req;
        const isCorrectSub = sub === "free" || sub === "pro" || sub === "premium";
        if (isCorrectSub) {
            const { user: { _id } } = req;
            console.log(_id);
            const contactNew = await UserModel.findOneAndUpdate({_id: _id}, {subscription: sub});
            await contactNew.save();
            return res.status(200).send(); 
        }
        res.status(500).send({message: "Uncorrect type of subscription"})
    } catch (e) {
      console.error(e);
      res.status(500).send(e);
    }
  });

exports.UsersRouter = router;