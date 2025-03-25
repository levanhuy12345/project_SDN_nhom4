const ModelUser = require('../models/ModelUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const ModelPayment = require('../models/ModelPayment');
const ForgotPassword = require('../SendMail/ForgotPassword');
require('dotenv').config();

class ControllerUser {
    async Register(req, res) {
        const { fullname, password, email, phone } = req.body;
        const saltRounds = 10;
        const myPlaintextPassword = password;
        try {
            const dataUser = await ModelUser.findOne({ email: email });
            if (dataUser) {
                return res.status(403).json({ message: 'Người Dùng Đã Tồn Tại !!!' });
            } else {
                bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
                    const newUser = new ModelUser({
                        fullname,
                        password: hash,
                        email,
                        phone: phone,
                    });
                    await newUser.save();
                    return res.status(200).json({ message: 'Đăng Ký Thành Công !!!' });
                });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi !!!' });
        }
    }

    async Login(req, res, next) {
        const { password, email } = req.body;
        const dataUser = await ModelUser.findOne({ email });
        if (!dataUser) {
            return res.status(401).json({ message: 'Email Hoặc Mật Không Chính Xác !!!' });
        }
        const match = await bcrypt.compare(password, dataUser.password);
        if (match) {
            const admin = dataUser.isAdmin;
            const token = jwt.sign({ email, admin }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
            const refreshToken = jwt.sign({ email, admin }, process.env.JWT_SECRET, { expiresIn: '30d' });
            return res.setHeader('Set-Cookie', `Token=${token}  ; max-age=360000 ;path=/`).json({
                message: 'Đăng Nhập Thành Công !!!',
            });
        } else {
            return res.status(401).json({ message: 'Email Hoặc Mật Khẩu Không Chính Xác !!!' });
        }
    }

    async GetUser(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        if (decoded) {
            ModelUser.findOne({ email: decoded.email }).then((dataUser) => {
                return res.status(200).json(dataUser);
            });
        } else {
            return res.status(401).json({ message: 'Có Lỗi Xảy Ra !!!' });
        }
    }

    Logout(req, res) {
        res.setHeader('Set-Cookie', `Token=${''};max-age=0 ;path=/`).json({});
    }

    async GetOrder(req, res) {
        ModelPayment.find({}).then((data) => res.status(200).json(data));
    }
    async ForgotPassword(req, res) {
        const dataUser = await ModelUser.findOne({ email: req.body.email });
        if (!dataUser) {
            return res.status(404).json({ message: 'Không Tìm Thấy Người Dùng !!!' });
        }
        const SECRET_KEY = process.env.JWT_SECRET;
        const OTP_EXPRIRY = '15m';
        const email = req.body.email;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const token = jwt.sign({ email, otp }, SECRET_KEY, { expiresIn: OTP_EXPRIRY });
        ForgotPassword(email, token, otp);
        return res.status(200).json({ message: 'Thành Công !!!' });
    }

    async ResetPassword(req, res) {
        const SECRET_KEY = process.env.JWT_SECRET;
        const { token, otp, newPassword } = req.body;

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const decoded = jwt.verify(token, SECRET_KEY);

        if (decoded.otp === otp) {
            ModelUser.updateOne({ email: decoded.email }, { password: hashPassword })
                .then(() => {
                    return res.status(200).json({ message: 'Khôi phục mật khẩu thành công !!!' });
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    return res.status(500).json({ error: 'Server error' });
                });
        } else {
            return res.status(401).json({ message: 'Bạn Cần Xem Lại Thông Tin ' });
        }
    }

    async getAllUser(req, res) {
        ModelUser.find({}).then((data) => res.status(200).json(data));
    }

    async DeleteUser(req, res) {
        const { id } = req.query;
        const findUser = await ModelUser.findOne({ _id: id });
        if (findUser._id === id) {
            return res.status(400).json({ message: 'Không thể xóa chính mình !!!' });
        }
        await ModelUser.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Xóa Người Dùng Thành Công !!!' });
    }
}

module.exports = new ControllerUser();
