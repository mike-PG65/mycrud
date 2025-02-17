require ('dotenv').config();
const mysql = require('mysql2');
const express= require('express');


const app =express();

app.use(express.json());


const db = mysql.createConnection({ 
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT
})

const promisedb = db.promise()


db.connect((err)=>{
    if (err) {
        console.error("Error connecting to the database!!!", err);
        return;
    }
    console.log("Connected to mysql");
});




app.post('/add-user', async (req, res)=> {

    const {firstname, lastname, email, gender, occupation}=req.body

    if(!firstname, !lastname, !email, !gender){
        return res.status(400).json({message: "All fields are required"})
    }

    const check ='SELECT * from users WHERE email = ?';
    const value =[email]

    try {
        const [rows] =await promisedb.query(check, value);
        if(rows.length>0){
            return res.status(400).json({message: 'User already exists'})

        }

        const insert ='INSERT INTO users (firstname, lastname, email, gender, occupation) VALUES (?, ?, ?, ?, ?) '
        const values =[firstname, lastname, email, gender, occupation]

        const [results] = await promisedb.query(insert, values);
         res.status(200).json({message: "User added to database", USERID: results.insertId})       
        console.log("User created")

        // const [results] = await promiseconnection.query(query, values);
        // res.status(200).json({ message: 'User added sucessfully', USERID: results.insertId})
        // console.log("User created")
      
    } catch (error) {
      console.error('Error inserting data into the database', error)
      res.status(500).json({message:'Failed to add user'})
      
    }

});


app.get('/User-list', async (req, res)=>{
    try {
        const [rows] = await promisedb.query('SELECT * FROM users');
        res.status(200).json(rows)

    } catch (error) {
        res.status(500).json('Failed to get users', error)
        
    }
})


app.listen(3000,()=>{
    console.log("App is listening to port 3000")
})