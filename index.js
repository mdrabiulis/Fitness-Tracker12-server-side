
const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// console.log(process.env)



// Express middleware

app.use(cors());
app.use(express.json());





app.get("/", (req, res) => {
  res.send("Fitness Tracker Website");
});

app.listen(port, () => {
  console.log(`Fitness Tracker Website ${port}`);
});
