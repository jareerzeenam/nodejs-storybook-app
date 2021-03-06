const express = require('express');
const router = express.Router();

const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Model
const Story = require('../models/Story');

//@desc Login/Landing page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    //uses the login layout
    layout: 'login',
  });
});

//@desc Dashboard
//@route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.displayName,
      avatar: req.user.image,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
