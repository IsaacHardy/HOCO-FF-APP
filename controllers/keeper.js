const Keeper = require('../models/Keeper');
const User = require('../models/User');

exports.getKeepersPage = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    users.forEach((u) => {
      Keeper.find({ ownerId: u._id})
        .populate('ownerId')
        .exec((err, keepers) => {
          res.render('keeper', { keepers: keepers, title: 'Keepers', users: users });
        });
    });


  });
}

exports.addKeeper = (req, res, next) => {
  if (!req.body.name || !req.body.round) {
    req.flash('errors', { msg: 'Name and Round cannot be blank.' });
    res.redirect('/keeper');
  } else if (!req.user) {
    req.flash('errors', { msg: 'You must be logged in to add a keeper.' });
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
      Keeper.find({})
        .populate('ownerId')
        .exec((err, keepers)=> {
          console.log(JSON.stringify(keepers, null, "\t"))
        });
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