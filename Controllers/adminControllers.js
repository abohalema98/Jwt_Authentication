let router = require('express').Router();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let { loginValidation } = require('../Validation/validations')
let mongoose = require('mongoose')
const verifyToken = require('../Controllers/verfiyToken')


require('../Model/AdminModel')
let Admin = mongoose.model('admins')


router.post('/adminLogin', async (request, response) => {
    const { error } = loginValidation(request.body)

    if (error) {
        response.status(400).send(error.details[0].message)
    };
    const admin = await Admin.findOne({ email: request.body.email })
    // console.log(user.type)

    if (!admin) {
        return response.status(400).send(`email doen't  exists `)
    }

    const validPassword = await bcrypt.compare(request.body.password, admin.password)

    if (!validPassword) {
        response.status(400).send('invalid password')

    }
    const token = jwt.sign({ role: admin.role, email: admin.email, password: admin.password }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXP
    })
    // response.header('Authorization').status(200).send({ token })
    // response.json({
    //     token:token
    // }).status(200).send('User Login')

   response.send(`admin Login \n token: ${token}  ` )
})

module.exports = router;

