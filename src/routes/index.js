const ProductsRoutes = require('./ProductsRoutes');
const UserRoute = require('./RoutesUser');
const ProductRoute = require('./ProductsRoutes');
const CartRoute = require('./RoutesCart');
const PaymentsRoutes = require('./RoutesPayments');
<<<<<<< HEAD
=======
const blogRoutes = require('./RoutesBlog');
>>>>>>> 7212757 (mix update)

function route(app) {
    // products
    app.get('/api/products', ProductsRoutes);
    app.post('/api/addproduct', ProductsRoutes);
    app.get('/api/product', ProductsRoutes);
    app.get('/api/search', ProductsRoutes);
    app.post('/api/editpro', ProductsRoutes);
    app.delete('/api/deleteproduct', ProductsRoutes);
    app.post('/api/editorder', ProductRoute);
    app.get('/api/similarproduct', ProductRoute);

    // User
    app.post('/api/register', UserRoute);
    app.post('/api/login', UserRoute);
    app.get('/api/auth', UserRoute);
    app.post('/api/logout', UserRoute);
    app.post('/api/forgotpassword', UserRoute);
    app.post('/api/resetpassword', UserRoute);

    // payment
    app.post('/api/payment', PaymentsRoutes);
    app.get('/api/payments', PaymentsRoutes);
    app.get('/api/checkdata', PaymentsRoutes);
    app.get('/api/payment', PaymentsRoutes);
    app.post('/api/paymentcod', PaymentsRoutes);
    app.get('/api/dataorderuser', PaymentsRoutes);
    app.post('/api/cancelorder', PaymentsRoutes);

    // Cart
    app.post('/api/addtocart', CartRoute);
    app.get('/api/cart', CartRoute);
    app.post('/api/deletecart', CartRoute);

    //admin
    app.get('/api/getallorder', UserRoute);
    app.get('/api/getalluser', UserRoute);
    app.delete('/api/deleteuser', UserRoute);
<<<<<<< HEAD
=======

    // Blog routes
    app.use('/api/blogs', blogRoutes);
    // app.get('/api/blogs', blogRoutes);
    // app.get('/api/blogs/:id', blogRoutes);
    // app.post('/api/blogs', blogRoutes);
    // app.put('/api/blogs/:id', blogRoutes);
    // app.delete('/api/blogs/:id', blogRoutes);
    // app.post('/api/blogs/:id/comments', blogRoutes);
    // app.post('/api/blogs/:id/like', blogRoutes);
>>>>>>> 7212757 (mix update)
}

module.exports = route;
