const Keeper = require('../models/Keeper');
const User = require('../models/User');

exports.getKeepersPage = (req, res) => {
  let myModel = [];
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    myModel = users;

    myModel.forEach((u) => {
      let keeperMax = 0;
      Keeper.find({ ownerId: u._id})
        .exec((err, keepers) => {
          u.keepers = keepers;

          if (req.user._id.toString() === u._id.toString()) {
            keeperMax = u.keepers.length;
            res.render('keeper', { users: myModel, title: 'users', keeperMax: keeperMax });
          } else {
            res.render('keeper', { users: myModel, title: 'users', keeperMax: keeperMax });
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