const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'Fullstack-Login'
require('dotenv').config()
const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.DATABASE_URL);

const allowedOrigins = ['http://localhost:3000', 'https://todo-hipposama.vercel.app', 'https://todo-omega-hazel.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
};

app.use(cors(corsOptions));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello')
})

//get
app.get('/todo/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;

  try {
    const [todo] = await pool.query('SELECT * FROM todo WHERE user_email = ?', [userEmail]);
    res.json(todo)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

//create
app.post('/todo', async (req, res) => {
  const {user_email, title, progress, date} = req.body;
  const id = uuidv4()
  try {
    const newtodo = await pool.query('INSERT INTO todo(id, user_email, title, progress, date) VALUES(?,?,?,?,?)',
    [id, user_email, title, progress, date])
    res.json(newtodo)
  }catch(err) {
    console.error(err)
  }
})

//edit
app.put('/todo/:id', async (req, res) => {
  const {id} = req.params
  const {user_email, title, progress, date} = req.body
  try {
    const edittodo = await pool.query('UPDATE todo SET user_email=?, title=?, progress=?, date=? WHERE id =?;',
    [user_email, title, progress, date, id])
    res.json(edittodo)
  }catch(err){
    console.error(err)
  }
})

//delete
app.delete('/todo/:id', async (req, res) => {
  const {id} = req.params
  try {
    const deletetodo = await pool.query('DELETE FROM todo WHERE id =?;', [id])
    res.json(deletetodo)
  }catch(err){
    console.error(err)
  }
})

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE email =?", [email]);
    if (!users[0].length) return res.json({ detail: "ไม่พบบัญชีดังกล่าว" });
    const success = await bcrypt.compare(password, users[0][0].password);

    if (success) {
      const token = jwt.sign({ email }, secret, { expiresIn: "1hr" });
      res.json({ email: users[0][0].email, token });
    } else {
      res.json({ detail: "รหัสไม่ถูกต้อง" });
    }
  } catch (err) {
    res.json({ detail: "รหัสผ่านหรืออีเมลผิด" });
  }
});


//register
app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  try {
    const signup = await pool.query('INSERT INTO users (email, password) VALUES(?,?)',
    [email, hashedPassword])

    const token = jwt.sign({ email }, 'secret', {expiresIn: '1hr'})
    res.json({email, token})    
  }catch(err){
    console.error(err)
    if (err) {
      res.json({detail: "อีเมลนี้ถูกใช้แล้ว"})
    }
  }
})


app.listen(8000, function () {
  console.log('web server running on port 8000')
})
