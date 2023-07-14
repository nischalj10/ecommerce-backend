const assert = require('assert');
const Cart = require('../cart.js');

describe('Cart', function() {
    describe('#TotalAfterDiscount()', function() {
        it('should return total after applying discount', function() {
            let newCart = new Cart();
            newCart.totalAfterDiscount = 100;
            assert.equal(newCart.totalAfterDiscount(), 100);
        });
    });
    
    describe('#CartTotal()', function() {
        it('should return total price of the cart', function() {
            let newCart = new Cart();
            newCart.cartTotal = 200;
            assert.equal(newCart.cartTotal(), 200);
        });
    });
    
    describe('#orderedBy()', function() {
        it('should return the user who ordered', function() {
            let newCart = new Cart();
            newCart.orderedBy = "User1";
            assert.equal(newCart.orderedBy(), "User1");
        });
    });
    
    describe('#Products()', function() {
        it('should return the products in the cart', function() {
            let newCart = new Cart();
            newCart.products = [{"product":"Product1", "count":2, "color":"red", "price":100}, {"product":"Product2", "count":1, "color":"blue", "price":200}];
            assert.deepEqual(newCart.products(), [{"product":"Product1", "count":2, "color":"red", "price":100}, {"product":"Product2", "count":1, "color":"blue", "price":200}]);
        });
    });
});