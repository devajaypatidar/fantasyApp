const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const teamRoutes = require('./routes/teamRoutes');
const players = require('./data/players.json');

require("dotenv").config()
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.json(players);
})

app.use('/api',teamRoutes);
app.listen(port,()=>{
  console.log('server started at http://localhost:'+port);
});

