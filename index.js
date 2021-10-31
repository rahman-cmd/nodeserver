const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

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
    const productsCollection = client.db("foodMaster").collection("products");
    const ordersCollection = client.db("foodMaster").collection("orders");

    //  make route and get data
    app.get("/products", (req, res) => {
        productsCollection.find({}).toArray((err, results) => {
            res.send(results);
        });
    });

    // get single prodcut
    app.get("/products/:id", (req, res) => {
        console.log(req.params.id);
        productsCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray((err, results) => {
                res.send(results[0]);
            });
    });
    //add product
    app.post("/products", (req, res) => {
        console.log(req.body);
        productsCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });
    });

    //  order get data
    app.get("/orders", (req, res) => {
        productsCollection.find({}).toArray((err, results) => {
            res.send(results);
        });
    });


    //add order in database
    app.post("/orders", (req, res) => {
        ordersCollection.insertOne(req.body).then((result) => {
            res.send(result);
        });
    });

    // get all order by email query
    app.get("/orders/:email", (req, res) => {
        console.log(req.params);
        ordersCollection
            .find({ email: req.params.email })
            .toArray((err, results) => {
                res.send(results);
            });
    });
});

app.listen(process.env.PORT || port);
