const express = require('express');
const router = express.Router();

const ControllerUser = require('../controllers/ControllerUsers');
<<<<<<< HEAD
const ControllerJWT = require('../jwt/ControllerJWT');
=======
const ControllerJWT = require('../middleware/jwt/ControllerJWT');
>>>>>>> 7212757 (mix update)

router.post('/api/register', ControllerUser.Register);
router.post('/api/login', ControllerUser.Login);
router.get('/api/auth', ControllerJWT.verifyToken, ControllerUser.GetUser);
router.post('/api/logout', ControllerJWT.verifyToken, ControllerUser.Logout);
router.get('/api/getallorder', ControllerJWT.verifyToken, ControllerUser.GetOrder);
router.post('/api/forgotpassword', ControllerUser.ForgotPassword);
router.post('/api/resetpassword', ControllerUser.ResetPassword);

router.get('/api/getalluser', ControllerJWT.verifyTokenAdmin, ControllerUser.getAllUser);
router.delete('/api/deleteuser', ControllerJWT.verifyTokenAdmin, ControllerUser.DeleteUser);

module.exports = router;
