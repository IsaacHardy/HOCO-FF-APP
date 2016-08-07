const Keeper = require('../models/Keeper');

exports.getKeepers = (req, res) => {
  Keeper.find().sort('-dateAdded').exec((err, keepers) => {
    if (err) {
      res.status(500).send(err);
    }
    res.render('keeper', { keepers: keepers, title: 'Keepers' });
  });
}

exports.addKeeper = (req, res, next) => {
  if (!req.body.name || !req.body.round) {
    res.status(403).end();
  }

  const newKeeper = new Keeper(req.body);

  newKeeper.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.redirect('/keeper');
  });
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