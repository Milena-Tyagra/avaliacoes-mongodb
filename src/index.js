require('dotenv').config();
const express = require('express')
const { MongoClient } = require('mongodb')
const cors = require("cors")

const app = express()
const port = 3000
app.use(express.json());
const indexRouter = require('./routes')

const uri = process.env.URI_MONGO;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}
));
app.use((req, res, next) => {
    req.dbClient = client;
    next();
});

app.use('/', indexRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ erro: err.message })
})

app.listen(port, () => {
    connectToDatabase()
    console.log(`Example app listening at http://localhost:${port}`)
})
