const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnelf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

client.connect((err) => {
    const productsCollection = client.db("online_shop").collection("products");
    const ordersCollection = client.db("online_shop").collection("orders");

    //  make route and get data
    app.get("/products", (req, res) => {
        productsCollection.find({}).toArray((err, results) => {
            res.send(results);
        });
    });

    // get single prodcut

    app.get("/singleProduct/:id", (req, res) => {
        console.log(req.params.id);
        productsCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray((err, results) => {
                res.send(results[0]);
            });
    });
    //add product
    app.post("/addProducts", (req, res) => {
        console.log(req.body);
        productsCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });
    });

    //add order in database
    app.post("/addOrders", (req, res) => {
        ordersCollection.insertOne(req.body).then((result) => {
            res.send(result);
        });
    });

    // get all order by email query
    app.get("/myOrders/:email", (req, res) => {
        console.log(req.params);
        ordersCollection
            .find({ email: req.params.email })
            .toArray((err, results) => {
                res.send(results);
            });
    });
});

app.listen(process.env.PORT || port);
