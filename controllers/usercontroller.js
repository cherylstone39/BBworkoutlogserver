const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



router.post("/register", async (req, res) => {

    let { username, password } = req.body.user;
    try {
    let newUser = await UserModel.create({
        username,
        password: bcrypt.hashSync(password, 15),
    });

    let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        message: "User successfully created",
        user: newUser,
        sessionToken: token
    })
    }
    catch (e){
        if(e instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
   });
   // LOGIN FOR USER //

router.post("/login", async (req, res) => {
    let { username, password } = req.body.user;

    try{    
    let loginUser = await UserModel.findOne({
        where: {
            username,
        }
    })
    if (loginUser) {

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken: token
    });
    } else {
        res.status(401).json({
            message: "Incorrect email or password"
        })
    }
    } else {
        res.status(401).json({
            message: "incorrect email or password"
        });
    } 
} catch (err) {
    res.status(500).json({
        message: "Failed to log user in"
    })
}
})
    module.exports = router;
