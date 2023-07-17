const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { dbConnection } = require('./database/config')

const app = express()
// Setup CORS
app.use(cors())
// Read and parse body
app.use(express.json())
// DB Connection
dbConnection()

// ROUTES
app.get('/', (req, res) => {
  res.status(200).send(`
    <div style="min-height: 100vh; width: 100vw; background-color: #000; color:#fff">
      <ul>
        <li>Root: /</li>
        <li>Agents: /api/agents
          <ul>
            <li>Get: /</li>
            <li>Post: /</li>
            <li>Patch: /:id</li>
            <li>Delete: /:id</li>
          </ul>
        </li>
        <li>Hotels: /api/hotels
          <ul>
            <li>Get: /</li>
            <li>Get: /priv</li>
            <li>Post: /</li>
            <li>Patch: /:id</li>
            <li>Delete: /:id</li>
            <li>get: /:id</li>
          </ul>
        </li>
        <li>Rooms: /api/rooms
        <ul>
          <li>Get: /</li>
          <li>Post: /</li>
          <li>Patch: /:id</li>
          <li>Delete: /:id</li>
          <li>Get: /:id</li>
        </ul>
      </li>
      <li>Reservations: /api/reservations
        <ul>
          <li>Get: /byEmail</li>
          <li>Get: /</li>
          <li>Get: /:id</li>
          <li>Post: /</li>
        </ul>
      </li>
      </ul>
    </div>
  `)
})

app.use('/api/agents', require('./routes/agent.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/hotels', require('./routes/hotel.routes'))
app.use('/api/rooms', require('./routes/room.routes'))
app.use('/api/reservations', require('./routes/reservation.routes'))
app.listen(process.env.PORT || 80, () => {
  console.log('Runing in port', process.env.PORT);
  console.log(process.env.EMAIL_PASS)
})

// POPULATE: TRAE LA REFERENENCIA DE LAS TABLAS
// paginar: Recibir query param from o algo, verificar si viene o no ese query param y usar el skip y limit para establecer el limite de paginas y devolver el total