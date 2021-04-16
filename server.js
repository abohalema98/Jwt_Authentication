require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const userRouter = require('./Router/UserRouter')
const adminRouter = require('./Router/AdminRouter')
const authUserController = require('./Controllers/userControllers')
const authAdminController = require('./Controllers/adminControllers')
const DB_CONNECTION = require('./Config/dbConfig')


DB_CONNECTION();

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())



app.use((request, response, next) => {
    console.log(request.url, request.method);
    next();
});


app.get('/', (request, response, next) => {
    response.send('server is run ')
    console.log('hello world')
    next()
})


app.use('/api/auth/user', authUserController);
app.use('/api/auth/admin', authAdminController);
app.use('/auth', userRouter)
app.use('/auth', adminRouter)


const Port = process.env.Port

app.listen(Port, () => {
    console.log('Server is listen...... ' + Port)
})