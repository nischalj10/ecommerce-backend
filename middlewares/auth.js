const admin = require('../firebase');
const User = require('../models/user')

exports.authCheck = async (req, res, next) => {
    console.log(req.headers); //token
    try {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
        //console.log('Firebase user in authcheck middleware', firebaseUser)
        req.user = firebaseUser;
        next();
    }

    catch (err) {
        res.status(401).json({
            err: "Invalid or expired token"
        })
    }

};

exports.adminCheck = async (req, res, next) => {
    const {email} = req.user

    const adminUser = await User.findOne({email : email}).exec()
    if (adminUser.role !== 'admin') {
        res.status(403).json({
            err : 'Adimn resource. Access denied'
        })
    } else {
        next();
    }

}