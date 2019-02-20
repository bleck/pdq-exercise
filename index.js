// Normally would worry about getting a build system like babel, but keeping it simple
const axios = require('axios')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const getImage = require('./imageDict') // Allows us to get images

// Constants
const apiURL = "https://pdqemployees.azurewebsites.net/api/pdqemployees"

// Middleware
app.use(express.static('ui'))

const getRandomEmployee = async () => {
  // Get employee from PDQ endpoint and make update objects with imgSrc included
  const employeeRequest = await axios.get(apiURL)
  return Object.assign(employeeRequest.data, {imgSrc: getImage(employeeRequest.data.name)})
}

// ROUTES 
// Endpoint to trigger update for displayed employee
let lastPayload   // Used to save last payload to send on connection
app.get("/api/employee", async (req, res) => {
  // Try/catch for await functionality - and catch the randomly failing API requests :)
  try{
    const employee = await getRandomEmployee()
    // Emit websocket message for everyone to update
    io.sockets.emit('refresh', employee)
    // Store the payload
    lastPayload = employee
    res.status(200).json({})
  }
  catch(e){
    // We failed, send over the message from the other server
    res.status(500).send(e.response.data)
  }
})

// Websocket subscriptions
io.on("connection", s => {
  // We send object with placeholder info if server starts and no one has triggered the API
  s.emit('refresh', lastPayload 
  ? lastPayload 
  : {name: "No one has gotten a random employee", drink: "Enjoy this random picture, and click the button to start", imgSrc: "https://placeimg.com/128/128/any"})
})


http.listen(3000, async () => {
  console.log('listening on *:3000')
})