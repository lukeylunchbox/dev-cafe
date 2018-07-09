const express = require('express')
const mongoose = require('mongoose')
const db = require('./config/keys').mongoURI

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()
const port = process.env.PORT || 5000

mongoose.connect(db)
  .then(() => {
    console.log('Successfully connected to MongoDB')
  })
  .catch(err => {
    console.log(err)
  })

app.get('/', (req, res) => {
  res.send('Hello')
})

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
