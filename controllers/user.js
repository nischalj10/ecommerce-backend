const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')
const uniqueid = require('uniqueid')
//carts

exports.userCart = async (req, res) => {
    //console.log(req.body)
    const {cart} = req.body;
    let products = []
    const user = await User.findOne({email: req.user.email}).exec()

    //check  if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({orderedBy : user._id}).exec()
    if(cartExistByThisUser) {
        await cartExistByThisUser.remove()
        console.log("removed old cart")

    }

    for(let i=0; i<cart.length; i++) {
        let object = {}

        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color
        //let price for getting total
        let productFromDb = await Product.findById(cart[i]._id).select("price").exec()
        object.price = productFromDb.price;

        products.push(object);
    }

    //console.log('PRODUCTS', products)
    let cartTotal = 0
    for(let i=0; i<products.length; i++) {
        cartTotal += products[i].price* products[i].count;
    }

    //console.log("CART TOTAL", cartTotal);

    let newCart = await new Cart({
        products : products,
        cartTotal : cartTotal,
        orderedBy : user._id,
    }).save();

    console.log("NEW CART ---->", newCart);

    res.json({ ok : true});
}

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({email : req.user.email}).exec()

    let cart = await Cart.findOne({orderedBy : user._id})
        .populate('products.product', '_id title price totalAfterDiscount')
        .exec();

        const {products, cartTotal, totalAfterDiscount} = cart;
        res.json({products, cartTotal, totalAfterDiscount}) //res.data.cartTotal
}

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({email : req.user.email}).exec()

    const cart = await Cart.findOneAndRemove({orderedBy : user._id}).exec()

    res.json(cart);
}

//checkout and coupon

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate({email : req.user.email},
        {address : req.body.address}).exec();

    res.json({ok : true});
}

exports.applyCouponToUserCart = async (req, res) => {
    const {coupon} = req.body
    //console.log('COUPON', coupon)

    const validCoupon = await Coupon.findOne({name : coupon}).exec();
    if(validCoupon === null){
        return res.json({
            err: "Invalid coupon"
        })
    }
    //console.log('Valid Coupon', validCoupon)

    const user = await User.findOne({email : req.user.email}).exec();

    let {products, cartTotal} = await Cart.findOne({orderedBy : user._id})
        .populate("products.product", "_id title price")
        .exec()

    //console.log('cartTotal', cartTotal, 'discount', validCoupon.discount);

    //total after discount
    let totalAfterDiscount = (cartTotal - (cartTotal*validCoupon.discount)/ 100).toFixed(2);

    await Cart.findOneAndUpdate({orderedBy: user._id},
        {totalAfterDiscount: totalAfterDiscount},
        {new: true}).exec()

    res.json(totalAfterDiscount);

}

exports.createOrder = async (req, res) => {
    const {paymentIntent} = req.body.stripeResponse
    const user = await User.findOne({email : req.user.email}).exec()

    let {products} = await Cart.findOne({orderedBy : user._id}).exec();

    let newOrder = await new Order({
        products,
        paymentIntent,
        orderedBy : user._id,
    }).save();

// decrement qty and increment sold
    let bulkOption = products.map((item) => {
        return{
            updateOne : {
                filter : {_id : item.product._id},  //IMPORTANT item.product
                update: {$inc : {quantity: -item.count, sold : +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOption, {});
    //console.log("PRODUCT QTY-- AND SOLD++", JSON.stringify(updated, null, 4))

    //console.log("NEW ORDER SAVED", newOrder)
    res.json({ok : true});
}

exports.orders = async (req, res) => {
    let user = await User.findOne({email : req.user.email}).exec()

    let userOrders = await Order.find({orderedBy : user._id})
        .populate("products.product")
        .exec();

    res.json(userOrders);
}

//wishlist

//the $addToSet is used when we do not want to add an item to db which is already present
// so to avoid duplication of products in user wishlist, we used it here
exports.addToWishlist = async (req, res) => {
    const {productId} = req.body
    const user = await User.findOneAndUpdate({email : req.user.email},
        {$addToSet : {wishlist : productId}},
        {new : true}
    ).exec()

    res.json({ok : true})
}

exports.wishlist = async (req, res) => {
    const list = await User.findOne({email : req.user.email})
        .select("wishlist")
        .populate("wishlist")
        .exec()

    res.json(list);

}

exports.removeFromWishlist = async (req, res) => {
    const {productId} = req.params;
    const user = await User.findOneAndUpdate({email : req.user.email},
        {$pull : {wishlist : productId}},
        {new : true}).exec();

    res.json({ok: true})
}

//COD

exports.createCashOrder = async (req, res) => {
    const {COD, couponApplied} = req.body;
    //if COD is true, create order with status of COD
    if(!COD) return res.status(400).send("CASH ORDER CREATION FAILED")

    const user = await User.findOne({email : req.user.email}).exec()

    let userCart = await Cart.findOne({orderedBy : user._id}).exec();

    let finalAmount = 0;
    if(couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100
    } else {
        finalAmount = userCart.cartTotal * 100
    }

    let newOrder = await new Order({
        products : userCart.products,
        paymentIntent : {
            id : uniqueid(),
            amount : finalAmount,
            currency : "inr",
            status: "Cash on delivery",
            created : Date.now(),
            payment_method_types : ['Cash'],
        },
        orderedBy : user._id,
        orderStatus : "Cash On Delivery"
    }).save();

// decrement qty and increment sold
    let bulkOption = userCart.products.map((item) => {
        return{
            updateOne : {
                filter : {_id : item.product._id},  //IMPORTANT item.product
                update: {$inc : {quantity: -item.count, sold : +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOption, {});
    //console.log("PRODUCT QTY-- AND SOLD++", JSON.stringify(updated, null, 4))

    //console.log("NEW ORDER SAVED", newOrder)
    res.json({ok : true});
}

