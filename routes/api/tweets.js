const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Tweet = require('../../models/Tweet');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// POST api/tweets
// Create a tweet
// Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newTweet = new Tweet({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const tweet = await newTweet.save();

      res.json(tweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// GET api/tweets
// Get all tweets from users u follow
// Private
router.get('/', auth, async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user.id);
    const followedUsers = loggedInUser.following;
    let tweetsFromFollowedUsers = [];

    let x = 0;
    while(x < followedUsers.length)
    {
      let object = followedUsers[x];
      let id = object.user;
      await Tweet.find({user: id}).sort({ date: -1 }).then(res => { 
        tweetsFromFollowedUsers.push(res);
      });
      x++;
    }
    
    res.json(tweetsFromFollowedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/tweets/all
// Get all tweets
// Private
router.get('/all', async (req, res) => {
  try {
    const tweets = await Tweet.find();
    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/tweets/:id
// Get tweet by ID
// Private
router.get('/:id',  async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    res.json(tweet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet not found' });
    }
    res.status(500).send('Server Error');
  }
});

// DELETE api/tweets/:id
// Delete a tweet
// Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    // Check user
    if (tweet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await tweet.remove();

    res.json({ msg: 'Tweet removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet not found' });
    }
    res.status(500).send('Server Error');
  }
});

// PUT api/tweets/like/:id
// Like a tweet
// Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    // Check if the tweet has already been liked
    if (
      tweet.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Tweet already liked' });
    }

    tweet.likes.unshift({ user: req.user.id });

    await tweet.save();

    res.json(tweet.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/tweets/unlike/:id
// Unlike a tweet
// Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    // Check if the tweet has already been liked
    if ( tweet.likes.filter(like => like.user.toString() === req.user.id).length === 0 )
    {
      return res.status(400).json({ msg: 'Tweet has not yet been liked' });
    }

    // Get remove index
    const removeIndex = tweet.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    tweet.likes.splice(removeIndex, 1);

    await tweet.save();

    res.json(tweet.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST api/tweets/comment/:id
// Comment on a tweet
// Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const tweet = await Tweet.findById(req.params.id);

      const newTweet = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      tweet.comments.unshift(newTweet);

      await tweet.save();

      res.json(tweet.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE api/tweets/comment/:id/:comment_id
// Delete comment
// Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    const comment = tweet.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = tweet.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    tweet.comments.splice(removeIndex, 1);

    await tweet.save();

    res.json(tweet.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
