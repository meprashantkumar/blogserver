import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async(req,res) => {
    try {
        const {name, email, password} = req.body
        let user = await User.findOne({email})

        if(user) return res.status(400).json({
            message: "User Already Exists"
        })

        const hashPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            name, email, password: hashPassword
        })

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

        res.status(201).json({
            message: "User Registered",
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


export const login = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user) return res.status(400).json({
            message: "Invalid credentials"
        })

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword) return res.status(400).json({
            message: "Invalid credentials"
        })

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

        res.status(200).json({
            message: `Welcome back ${user.name}`,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

export const myProfile = async(req,res) => {
    try {
        const user = await User.findById(req.user._id)

        res.json({user})
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}