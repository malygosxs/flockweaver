const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '7d'}
    )
}


class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        if (!email || !password) {            
            return next(ApiError.badRequest('Invalid email or password'))
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return res.status(404).json({message: 'User with this email is already registered'})
            return next(ApiError.badRequest('User with this email is already registered'))
        }
        const hashPassword = await bcrypt.hash(password, 6)
        const user = await User.create({
            email,
            password: hashPassword,
            role,
            //sw_tag
        })

        const token = generateJwt(user.id, email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(404).json({message: 'User with that email is not exist'})
        }
        let checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) {
            return res.status(404).json({message: 'Wrong password'})
        }
        const token = generateJwt(user.id, email, user.role)
        return res.json({token})    
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email,req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()