const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        picture: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },

    }, { timestamps: true }
)

userSchema.methods.matchPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);
module.exports = User;