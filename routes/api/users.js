const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

const validateRegisterInput = require('../../validation/register')

router.get('/test', (req,res)=> {
  res.json({msg: 'Users Works!'})
})

router.post('/register', (req,res)=> {
  const { errors, isValid } = validateRegisterInput(req.body)
if(!isValid) {
  return res.status(400).json(errors)
}

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        errors.email = 'A user with that email already exists'
        return res.status(400).json(errors)
      }
      else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: avatar
        })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err
          newUser.password = hash
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
      }
    })
})

// return JWT token upon login
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password 

  User.findOne({email: email})
    .then(user => {
      //check for user
      if(!user) {
        return res.status(404).json({email: 'User not found'})
      }
      //check password
      //password is un-hashed, user.password is hashed
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User matched
            const payload = { id: user.id, name: user.name, avatar: user.avatar }
            //Sing token
            jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
          }
          else {
            return res.status(400).json({password: 'Incorrect Password'})
          }
        })
    })
})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router