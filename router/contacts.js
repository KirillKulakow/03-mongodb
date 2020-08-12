const express = require('express');
const { ContactModel } = require('../database');
const router = express.Router();

const initialPaginate = {
  page: 1,
  limit: 10
};

router.get('/', async (req, res) => {
  let pageReq = req.query.page ? req.query.page : initialPaginate.page;
  let limitReq = req.query.limit ? req.query.limit : initialPaginate.limit;
  let subReq = {subscription: req.query.sub} ? {subscription: req.query.sub} : {};
  ContactModel.paginate(subReq, { page: pageReq, limit: limitReq }, function(err, result) {
    if (err) {
      console.err(err);
    } else {
      res.json(result)
    };
  });
});

router.get('/:contactId', async (req, res) => {
  try {
    const { params: { contactId } } = req;
    const contact = await ContactModel.findById(contactId);
    res.status(200).send({contact});
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, password, subscription, email } = req.body;
    const contact = await ContactModel.create({ name, phone, password, subscription, email });
    res.status(201).send({contact})
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.patch('/:contactId', async (req, res) => {
  try {
    const { body } = req;
    const { params: { contactId } } = req;
    const contact = await ContactModel.findByIdAndUpdate(contactId, body);
    await contact.save();
    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.delete('/:contactId', async (req, res) => {
  const { params: { contactId } } = req;
  const contact = await ContactModel.findByIdAndDelete(contactId);
  if (!contact) throw new Error('Contact not found');
  await contact.delete();
  res.send();
});

exports.ContactRouter = router;
