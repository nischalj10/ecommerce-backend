const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    //coupon check
    const {couponApplied} = req.body;

    //1 find user
    const user = await User.findOne({email : req.user.email}).exec()

    //2 get user cart total
    const {cartTotal, totalAfterDiscount} = await Cart.findOne({orderedBy : user}._id).exec()
    //console.log('CART TOTAL AMOUNT', cartTotal, 'AFTER DISCOUNT', totalAfterDiscount)

    let finalAmount = 0;
    if(couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount * 100
    } else {
        finalAmount = cartTotal * 100
    }

    //3 create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount : finalAmount, // *100 bcoz stripe gets the value in cents/paise. so we multiply by 100 to nullify the /100 of stripe
        currency: 'inr',
    })

    console.log("CLIENT SECRET ----->>", paymentIntent.client_secret)

    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable : finalAmount,
    })
}