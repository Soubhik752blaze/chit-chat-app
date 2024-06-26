const generateToken = require("../Config/generateToken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                message: 'Please Enter all fields for registration'
            });
        }

        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(400).json({
                message: 'User exists aready with given email'
            });
        }

        let newUserObj = { name, email, password, pic };
        const newUser = await User.create(newUserObj);

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name,
                email,
                pic,
                token: generateToken(newUser._id)
            })
        } else {
            res.status(400).json({
                message: 'Failed to register user'
            });
        }
    }
    catch (e) {
        console.log(e);
    }

};

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        if (!email || !password) {
            res.status(400).json({
                message: 'All fields needed for logging in'
            });
        }

        const user = await User.findOne({ email: email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                picture: user.picture,
                token: generateToken(user._id),
            });
        }
        else if (!user) {
            res.status(400).json({
                message: 'New Users need to Signup!'
            });
        }
        else if (user.password !== password) {
            res.status(400).json({
                message: 'Incorrect Password'
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error occured while authorising user'
        })
    }
}

const changeProfilePicture = async (req, res) => {
    console.log('inside changeProfilePicture')
    const userId = req.user._id;
    const { pic } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { picture: pic },
            { new: true } // return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Profile picture updated successfully')
        res.status(200).json({
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in updating profile picture' });
    }
}

// api/user?search={username}
const allUsers = async (req, res) => {
    // console.log(req.query.search);22
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res.status(200).send(users);
}


module.exports = { registerUser, authUser, allUsers, changeProfilePicture };