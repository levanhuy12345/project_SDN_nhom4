const axios = require('axios');
const crypto = require('crypto');
const ModelCart = require('../models/ModelCart');
const ModelPayment = require('../models/ModelPayment');
const ModelUser = require('../models/ModelUser');
const { jwtDecode } = require('jwt-decode');

require('dotenv').config();

class ControllerPayments {
    async PaymentsMomo(req, res) {
        try {
            const token = req.cookies.Token;
            if (!req.body.address) {
                return res.status(400).json({ message: 'Bạn đang thiếu thông tin !' });
            }
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const dataCart = await ModelCart.findOne({ user: decoded.email });
            if (!dataCart) {
                return res.status(401).json({ message: 'Please add product to cart' });
            }

            const address = req.body.address; // Get address from the client
            if (!address) {
                return res.status(400).json({ message: 'Bạn đang thiếu thông tin !' });
            }

            const partnerCode = 'MOMO';
            const accessKey = 'F8BBA842ECF85';
            const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            const requestId = partnerCode + new Date().getTime();
            const orderId = requestId;
            const orderInfo = decoded.email;
            const redirectUrl = `http://localhost:5001/api/checkdata`;
            const ipnUrl = `http://localhost:5001/api/checkdata`;
            const amount = dataCart.sumprice;
            const requestType = 'captureWallet';
            const extraData = `${address}`; // Include address in extraData

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'en',
            };

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async checkData(req, res) {
        try {
            const email = req.query.orderInfo;
            const amount = req.query.amount;
            const address = req.query.extraData;

            if (req.query.resultCode === '1006') {
                return res.redirect(`${process.env.REACT_APP_URL_DOMAIN}/payments`);
            }

            if (!email) {
                return res.status(400).json({ message: 'Invalid order info' });
            }

            const cart = await ModelCart.findOne({ user: email });
            const dataUser = await ModelUser.findOne({ email: email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty or not found' });
            }

            const lastPayment = await ModelPayment.findOne({ user: email }).sort({ id: -1 });
            const newProductId = lastPayment && lastPayment.id !== undefined ? lastPayment.id + 1 : 0;

            const newPayment = new ModelPayment({
                id: newProductId,
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: amount,
                tinhtrang: false,
                trangthai: true,
                user: email,
                address: address,
                phone: cart.phone,
                username: dataUser.fullname,
            });

            await newPayment.save();
            await ModelCart.deleteOne({ user: email });

            res.redirect(`${process.env.REACT_APP_URL_DOMAIN}/paymentsuccess`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getPayment(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.findOne({ user: decoded.email })
            .sort({ _id: 'desc' })
            .then((data) => res.status(200).json([data]));
    }
    async PaymentCod(req, res) {
        try {
            const token = req.cookies.Token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const cart = await ModelCart.findOne({ user: decoded.email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }

            const sumprice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

            const dataUser = await ModelUser.findOne({ email: decoded.email });

            const newPayment = new ModelPayment({
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: sumprice,
                tinhtrang: false,
                trangthai: false,
                user: decoded.email,
                address: req.body.address,
                phone: cart.phone,
                username: dataUser.fullname,
            });

            await newPayment.save();
            await ModelCart.deleteOne({ user: decoded.email });

            res.status(200).json({ message: 'Thanh Toán Thành Công !!!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getPayments(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.find({ user: decoded.email }).then((data) => res.status(200).json(data));
    }

    async GetOrderUser(req, res) {
        ModelPayment.find({}).then((data) => {
            const newData = data.map((item) => item.products);
            return res.status(200).json(newData);
        });
    }

    async CancelOrder(req, res) {
        const { id } = req.body;
        ModelPayment.deleteOne({ _id: id }).then((data) => {
            return res.status(200).json({ message: 'Hủy đơn hàng thành công !!!' });
        });
    }
}

module.exports = new ControllerPayments();
