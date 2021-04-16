let router = require('express').Router();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let { loginValidation } = require('../Validation/validations')
let mongoose = require('mongoose')
const verifyToken = require('../Controllers/verfiyToken')


require('../Model/UserModel')
let User = mongoose.model('users')


router.use(verifyToken, async (request, response, next) => {

    if (await request.user.role == 'user') {
        next()
    } else {
        response.status(401).json({
            data: "you are not allow to see page",
            Role: request.user.role,
            Email: request.user.email


        })
    }
})

router.post('/userLogin', async (request, response) => {
    const { error } = loginValidation(request.body)

    if (error) {
        response.status(400).send(error.details[0].message)
    };
    const user = await User.findOne({ email: request.body.email })
    // console.log(user.type)

    if (!user) {
        return response.status(400).send(`email doen't  exists `)
    }

    const validPassword = await bcrypt.compare(request.body.password, user.password)

    if (!validPassword) {
        response.status(400).send('invalid password')

    }
    const token = jwt.sign({ role: user.role, email: user.email, password: user.password }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXP
    })
    // response.header('Authorization').status(200).send({ token })
    // response.json({
    //     token:token
    // }).status(200).send('User Login')

   response.send(`User Login \n token: ${token} role:${request.user.role} ` )
})

module.exports = router;

