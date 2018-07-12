const express = require('express')
const mongoose = require('mongoose')
const db = require('./config/keys').mongoURI
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(db)
  .then(() => {
    console.log('Successfully connected to MongoDB')
  })
  .catch(err => {
    console.log(err)
  })

//Passport middleware
app.use(passport.initialize())
//Passport config
require('./passport.js')(passport)

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
