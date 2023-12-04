const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
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

    const newslettercollection = client
      .db("assignment12DB")
      .collection("newsletter");
    const trainercollection = client.db("assignment12DB").collection("trainer");
    const classescollection = client.db("assignment12DB").collection("classes");
    const appliedcollection = client.db("assignment12DB").collection("applied");
    const reviewscollection = client.db("assignment12DB").collection("reviews");
    const usercollection = client.db("assignment12DB").collection("user");



    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email
      const query ={ email:email};
      const user = await usercollection.findOne(query)
      const isAdmin = user?.role === 'admin';
      if (isAdmin) {
        return res.status(403).send({message: 'forbidden access'})
      }
      next()
    }




    const verifyToken =  (req, res, next) => {
      console.log("ko tokendsd", req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "forbidden access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, access.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unaoooo" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        // expiresIn: "2s",
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // admin=======



app.get('/users/admin/:email', verifyToken, async (req, res) => {
  const email =req.params.email
  if (email !== req.decoded.email) {
    return res.status(403).send({message: 'unauthorized access'})
  }
  const query = {email: email}
  const user =await usercollection.findOne(query)
  let admin =false;
  if (user) {
    admin = user.role=== 'admin'
  }
  res.send({admin})
})



    app.get("/user", verifyToken, async (req, res) => {
      const result = await usercollection.find().toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const userdata = req.body;
      const query = { email: userdata.email };
      const useremail = await usercollection.findOne(query);
      if (useremail) {
        return res.send({ message: "user already add" });
      }
      const result = await usercollection.insertOne(userdata);
      res.send(result);
    });

    app.delete("/user/:id",  async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/user/:id",  async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
      const updateDoc = {
        $set: {
          role: "trainer",
        },
      };
      const result = await usercollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put("/user/:id",  async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usercollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // reviews

    app.get("/reviews", async (req, res) => {
      const result = await reviewscollection.find().toArray();
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const data = req.body;
      const result = await reviewscollection.insertOne(data);
      res.send(result);
    });

    // applied class
    app.post("/applied", async (req, res) => {
      const applied = req.body;
      const result = await appliedcollection.insertOne(applied);
      res.send(result);
    });

    // Newsletter
    app.post("/newsletter", async (req, res) => {
      const data = req.body;
      const result = await newslettercollection.insertOne(data);
      res.send(result);
    });

    app.get("/newsletter", async (req, res) => {
      const result = await newslettercollection.find().toArray();
      res.send(result);
    });

    // Trainer Section

    app.get("/trainer", async (req, res) => {
      const result = await trainercollection.find().toArray();
      res.send(result);
    });

    app.get("/trainer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await trainercollection.findOne(query);
      res.send(result);
    });

    // Classes Section

    app.get("/classes", async (req, res) => {
      const result = await classescollection.find().toArray();
      res.send(result);
    });

    app.get("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classescollection.findOne(query);
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
