const express = require('express');
const multer = require('multer');
const { UserModel } = require('../database');
const { minifyImage, storage } = require('../services/generateAvatar');
const router = express.Router();

const upload = multer({storage});

router.get('/current', (req, res) => {
    res.status(200).send({email: req.user.email, subscription: req.user.subscription})
});

router.patch('/avatars', upload.single('img_file'), async (req, res) => {
  try {
    const { user, file } = req;
    const { filename } = file;
    const avatarURL = await minifyImage(filename);
    console.log(avatarURL)
    await UserModel.findOneAndUpdate({_id: user._id}, { avatarURL: avatarURL });
    return res.status(200).json({
      avatarURL,
    });
  } catch (e) {
    res.status(500).send({message: e});
  }
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