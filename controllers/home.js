/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.coming = (req, res) => {
  res.render('coming', {
    title: 'Coming Soon'
  });
};
