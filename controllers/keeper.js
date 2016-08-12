const Keeper = require('../models/Keeper');
const User = require('../models/User');
const async = require('async');

exports.getKeepersPage = (req, res) => {
  let myModel = [];
  let keeperMax = 0;
  User.find({}).exec((err, users) => {
    myModel = users;

    let numRunningQueries = 0;

    myModel.forEach((u) => {
      ++numRunningQueries;
      Keeper.find({ ownerId: u._id})
        .exec((err, keepers) => {
          u.keepers = keepers;

          if (req.user._id.toString() === u._id.toString()) {
            keeperMax = u.keepers.length;
          }

          --numRunningQueries;
          if (numRunningQueries === 0) {

             res.render('keeper', { users: myModel, keeperMax: keeperMax });
          }
        });
    });
  });
}

exports.addKeeper = (req, res, next) => {
  if (!req.body.name || !req.body.round) {
    req.flash('errors', { msg: 'Name and Round cannot be blank.' });
    res.redirect('/keeper');
  } else {
    const newKeeper = new Keeper({
      name: req.body.name,
      round: req.body.round,
      ownerId: req.user._id,
      ownerName: req.user.profile.name
    });

    newKeeper.save((err, saved) => {
      if (err) { return next(err); }

      req.flash('success', { msg: 'Success! You added your keeper.' });
      res.redirect('/keeper');
    });
  }

}

exports.getKeeper = (req, res) => {
  Keeper.findOne({ _id: req.body.keeper._id }).exec((err, keeper) => {
    if (err) {
      res.status(500).send(err);
    }
  });
}

exports.deleteKeeper = (req, res) => {
  Keeper.findOne({ _id: req.body.keeper._id }).exec((err, keeper) => {
    if (err) {
      res.status(500).send(err);
    }

    keeper.remove(() => {
      res.status(200).end();
    });
  });
}