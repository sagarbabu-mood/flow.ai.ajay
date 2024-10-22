const express = require("express")
const app = express()

const db = require ("./db")
app.use(express.json())

app.listen(4000,()=>{
    console.log("Server is  Running at http://localhost:4000")
})

app.post("/transactions" ,async(request,response)=>{
    const {type, category, amount, date, description} = request.body 

    const insertQuery = `INSERT INTO transactions (type, category, amount, date, description)
    VALUES(
    '${type}',
    '${category}',
    '${amount}',
    '${date}',
    '${description}');`;

    const ddbResponse= await db.run(insertQuery);
    const lastId = ddbResponse.lastID;
    response.send({id:lastId})
});

// GET API 
app.get("/transactions", async (request,response)=>{
    const getQuary = `SELECT * FROM transactions`;

    const responseArray = await db.all(getQuary);
    response.send(responseArray)
})

//GET /transactions/:id API 

app.get("/transactions/:id", async (request,response)=>{
    const {id} = request.params;

    const getTransactionQuary = `SELECT * FROM transactions WHERE id = '${id}';`;

    const responseArray = await db.get(getTransactionQuary);
    response.send(responseArray)
});

//PUT /transactions/:id

app.put("/transactions/:id",async (request,response)=>{
    const {id} = request.params 
    const { type, category, amount, date, description } = req.body;

    const updateQuary = `UPDATE transactions SET
    type = '${type}',
    category = '${category}',
    amount = '${amount}',
    date = '${date}',
    description = '${description}'
    WHERE id = '${id}';`;
    await db.run(updateQuary)
    response.send(" Transaction updated successfully!")

});

//DELETE /transactions/:id
app.delete("/transactions/:id",async (request,response)=>{
    const {id} = request.params 
    const deleteQuary = `DELETE FROM transactions WHERE id = '${id}'`
    await db.run(deleteQuary)
    response.send("Transaction deleted successfully")
});

//GET /summary API 
app.get("/summary", async (request,response)=>{
    const query = `
    SELECT 
      IFNULL(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
      IFNULL(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expenses,
      (IFNULL(SUM(CASE WHEN type = 'income' THEN amount END), 0) -
       IFNULL(SUM(CASE WHEN type = 'expense' THEN amount END), 0)) AS balance
    FROM transactions;
  `;
  const array = await db.all(query)
  response.send(array)
})