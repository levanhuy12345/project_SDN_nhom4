const express = require('express');
const router = express.Router();

const ControllerCart = require('../controllers/ControllerCart');

router.post('/api/addtocart', ControllerCart.AddToCart);
router.post('/api/deletecart', ControllerCart.DeleteCart);
router.get('/api/cart', ControllerCart.GetCart);

module.exports = router;
