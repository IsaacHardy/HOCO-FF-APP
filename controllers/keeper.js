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

          if (req.user._id && req.user._id.toString() === u._id.toString()) {
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
  if (!req.body.firstName || !req.body.lastName || !req.body.round) {
    req.flash('errors', { msg: 'First Name, Last Name, and Round cannot be blank.' });
    res.redirect('/keeper');
  } else {
    const newKeeper = new Keeper({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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

exports.deleteKeeper = (req, res) => {
  Keeper.findOne({ _id: req.params.id }).exec((err, keeper) => {
    if (err) {
      res.status(500).send(err);
    }
    console.log(keeper);

    if (keeper.ownerId.toString() === req.user._id.toString()) {
      keeper.remove(() => {
        req.flash('info', { msg: 'You have successfully deleted your keeper.' });
        res.redirect('/keeper');
      });
    } else {
      req.flash('errors', { msg: 'You do not have permission to delete this keeper.' });
      res.redirect('/keeper');
    }
  });
}