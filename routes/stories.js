const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();

const { ensureAuth } = require('../middleware/auth');

//Model
const Story = require('../models/Story');

//! @desc Show add page (create)
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

//! @desc Process add form (store)
//@route POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    //uses express body parser in the app.js
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

//! @desc Show all stories (index)
//@route GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

//! @desc Show Story (show)
//@route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    // console.log(story);
    if (!story) {
      return res.redirect('error/404');
    }

    res.render('stories/show', {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

//! @desc Show edit page (edit)
//@route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    // console.log(story);

    if (!story) {
      return res.render('error/404');
    }
    //if the edit story is not belongs to the logged user redirects to stories
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//! @desc Update story (update)
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    //if the edit story is not belongs to the logged user redirects to stories
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

// ! @desc Delete Story (delete)
//@route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//! @desc Show User stories
//@route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
