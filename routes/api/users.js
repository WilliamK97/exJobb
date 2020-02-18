const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// GET api/users/all
// Get all User
// Private
router.get('/all', async (req, res) => {
  try {
    const user = await User.find().select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST api/users
// Make account and get TOken
// Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// PUT api/users/follow/:id
// Follow a user
// Private
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //get logged in user in var
    const loggenInUser = await User.findById(req.user.id);

    // Check if the User has already been followed
    if (loggenInUser.following.filter(f => f.user.toString() === user.id).length > 0) {
      return res.status(400).json({ msg: 'User already followed' });
    }

    user.followers.unshift({ user: loggenInUser })
    loggenInUser.following.unshift({ user: user });

    await user.save();
    await loggenInUser.save();

    res.json(loggenInUser.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/users/unfollow/:id
// Unfollow a user
// Private
router.put('/unfollow/:id', auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let loggenInUser = await User.findById(req.user.id);

    // Check if the User has already been followed
    if (loggenInUser.following.filter(f => f.user.toString() === user.id).length === 0) {
      return res.status(400).json({ msg: 'User has not yet been followed' });
    }

    // Get remove index following
    // const removeIndex = loggenInUser.following
    //   .map(f => f.user.toString())
    //   .indexOf(user);

      // var i = 0;
      // tempi = 0;
      // loggenInUser.following.forEach(element => {
      //   if(element.user.toString() === req.params.id.toString())
      //   {
      //     tempi = i;
      //     console.log("found it")
      //   }
      //   i++;
      // });
      // console.log(tempi);

    // Get remove index followers
    // const removeIndex1 = user.followers
    // .map(f => f.user.toString())
    // .indexOf(loggenInUser);
    
    // console.log('Clicked user:',req.params.id,'Current user:',req.user.id )
    console.log("loggenInUser.following Before:", loggenInUser.following.length)
    loggenInUser.following = loggenInUser.following.filter(user => user.user.toString() !== req.params.id.toString());
    console.log("loggenInUser.following after:", loggenInUser.following.length)
    console.log("user.followers before ", user.followers.length)
    user.followers = user.followers.filter(user => user.user.toString() !== req.user.id.toString());
    console.log("user.followers after: ",user.followers.length)
    //  user.followers.splice(removeIndex1, 1);
    //  loggenInUser.following.splice(removeIndex, 1);

     await user.save();
     await loggenInUser.save();

    res.json(loggenInUser.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('unfollow: Server Error');
  }
});


module.exports = router;
