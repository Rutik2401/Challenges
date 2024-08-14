const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./src/models/transactionModel.js');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
//connect to the database
const dbConnect = require("./src/config/database");
dbConnect();
app.get('/', (req, res) => {
    res.send('Backend is running');
});
app.get('/transaction',async (req,res)=>{
    try {
        const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
       
        const data = await response.json();         
        res.status(200).send(data);
    } catch (error) {
        console.error('Error:', error);
       
    }
});
app.get('/save-db', async (req, res) => {
    try {
        const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();         

        const processedData = data.map(item => ({
            ...item,
            dateOfSale: new Date(item.dateOfSale)
        }));

        await Product.deleteMany(); 
        await Product.insertMany(processedData);

        res.status(200).send("Data Inserted Successfully...!");
    } catch (error) {
        console.error('Error:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
