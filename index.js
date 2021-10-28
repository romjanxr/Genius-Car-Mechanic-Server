const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhdj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const serviceCollections = database.collection('services');

        //GET API

        app.get('/services', async (req, res) => {
            const cursor = serviceCollections.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get Single Item

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting service details of', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollections.findOne(query);
            res.json(service)
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollections.insertOne(service);
            res.json(result);
            console.log('hitting the post', service, result);
        });

        // DELETE API

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollections.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Genius Car Server');
});

app.listen(port, () => {
    console.log('Genius server is running on port: ', port);
})