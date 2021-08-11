//common setup//
const express = require('express');
const password = 'rFsFs2TqQB6u5GfL';
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
const uri = 'mongodb+srv://newPractice:rFsFs2TqQB6u5GfL@cluster0.0mhgi.mongodb.net/freashstart?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db('freashstart').collection('products')
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    console.log(products)
    productCollection.insertOne(products)
      .then(result => {
        console.log('one product added')
        res.redirect('/')
      })
      .catch(error => console.log(error))
  })
  app.patch('/update/:id',(req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{price:req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
  })
})

app.listen(3000)