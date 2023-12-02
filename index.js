const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const access = process.env;

// Express middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${access.USER_AC}:${access.DATABASE_SECRET_KEY}@cluster0.wvvqbv9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const Newslettercollection = client.db("assignment12DB").collection("newsletter");
    const trainercollection = client.db("assignment12DB").collection("trainer");

    // Newsletter
    app.post("/newsletter", async (req, res) => {
      const data = req.body;
      const result = await Newslettercollection.insertOne(data);
      res.send(result);
    });

    app.get("/newsletter", async (req, res) => {
      const result = await Newslettercollection.find().toArray();
      res.send(result);
    });

    // Trainer Section

    app.get("/trainer", async (req, res) => {
      const result = await trainercollection.find().toArray();
      res.send(result);
    });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fitness Tracker Website");
});

app.listen(port, () => {
  console.log(`Fitness Tracker Website ${port}`);
});
