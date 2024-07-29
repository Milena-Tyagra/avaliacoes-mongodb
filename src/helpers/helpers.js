const { MongoClient } = require('mongodb');
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require("dotenv").config();

module.exports = {
    getColectionAndId: (req, collection_name) => {
        const client = req.dbClient;
        const { id } = req.params;
        let objectId;
        if(id) {
          objectId = new ObjectId(id);
        }
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(collection_name);
        
        return { collection, objectId }
    },
    checkIsEmpty: value => {
        const empty_values = ['', null, undefined]
        return empty_values.includes(value);
    },

    conectToDBTests: async (collection_name) => {
        const uri = process.env.URI_MONGO;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const database = client.db(process.env.MONGO_DB_NAME_TEST);
            const collection = database.collection(collection_name);
            console.log('Conectado ao MongoDB');

            return collection
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
        }
    },
    chechPassword: async (userPassword, informedPassword) => {
        return await bcrypt.compare(informedPassword, userPassword)
    },
    generateToken: (params={}) => {
        return jwt.sign(params, process.env.AUTH_SECRET, {
            expiresIn: 86400
        })
    }
}