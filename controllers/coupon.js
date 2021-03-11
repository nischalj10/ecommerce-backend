const Coupon = require('../models/coupon')

//create, remove, list

exports.create = async (req, res) => {
    try {
        const {name, expiry, discount} = req.body.coupon;
        res.json(await new Coupon({name, expiry, discount}).save())

    } catch (err) {
        console.log("COUPON CREATE ERROR IN CONTROLLER --->",err)
    }
}

exports.remove = async (req, res) => {
    try {
        res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec())
    } catch (err) {
        console.log("COUPON REMOVE ERROR IN CONTROLLER --->",err)
    }
}

exports.list = async (req, res) => {
    try {
        res.json(await Coupon.find({}).sort({createdAt: -1}).exec())
    } catch (err) {
        console.log("COUPON LIST ERROR IN CONTROLLER --->",err)
    }
}

