let express = require('express');
let mongoose = require('mongoose')
let { Validations } = require('../Validation/validations')
mongoose.set('useFindAndModify', false);
let _lodash = require('lodash')
const bcrypt = require('bcrypt')


let userRouter = express.Router();
require('../Model/UserModel')
let userSchema = mongoose.model('users')


userRouter.route('/users')

    .get(async (request, response) => {

        await userSchema.find({})
            .then((data) => { response.send(data) })
            .catch((err) => { throw new Error(err) })
    })

    .post(async (request, response) => {

        const { error } = Validations(request.body)

        if (error) {
            return response.status(400).send(error.details[0].message)
        };

        const emailExists = await userSchema.findOne({ email: request.body.email });

        if (emailExists) { return response.status(400).send(`email already exists ${emailExists.email}`) }
        //Hasing the password
        // const salt = await bcrypt.genSalt(6)
        const hashedPassword = await bcrypt.hashSync(request.body.password, 8)

        let userObject = new userSchema({
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
            role: request.body.role,
        })

        try {
            const savedObject = await userObject.save()
            response.send(_lodash.pick(savedObject, ['_id', 'name', 'email', 'password', 'role']))
        } catch (err) {
            response.status(400).send(err)
        }



    }) // Post 

    .put(async (request, response) => {
        await userSchema.replaceOne({ _id: request.body.id }, {
            $set: { name: request.body.name, password: request.body.password, email: request.body.email, role: request.body.role }
        })
            .then((dataUpdate) => { response.send(dataUpdate) })
            .catch((err) => { response.sendStatus(400) })
    })

    .delete(async (request, response) => {
        await userSchema.deleteOne({ _id: request.body.id })

            .then((data) => { response.send(data) })
            .catch((err) => { response.send(err) })

    })



module.exports = userRouter;