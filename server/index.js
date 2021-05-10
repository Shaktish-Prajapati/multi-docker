const keys = require('./keys')

// EXPRESS APP SETUP
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup: SQL type DB
const {Pool} = require('pg');
const { pgHost, pgDatabase, pgPassword, pgPort, pgUser } = require('./keys');

const pgClient = new Pool({
    user:pgUser,
    host:pgHost,
    database:pgDatabase,
    password:pgPassword,
    port:pgPort
})

pgClient.on("connect", (client) => {
    client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client setup
const redis = require('redis');
const { redisHost, redisPort } = require('./keys');
const redisClient = redis.createClient({
    host:redisHost,
    port:redisPort,
    retry_strategy: ()=> 1000
});
const redisPublisher = redisClient.duplicate();

// Express Route Handler
app.get('/',(req,res)=>{
    res.send('Hi!!');
});

app.get('/values/all',async (req,res)=>{
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get('/values/current',async (req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        res.send(values);
    });
});

app.post('/values',async(req,res)=>{
    const index = req.body.index;
    if(parseInt(index)>40) return res.status(422).send('Index too high');
    console.log(index)
    redisClient.hset("values",index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({working: true});
});

app.listen(5000, err => console.log('Listning at 5000'));