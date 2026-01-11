const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/available-rooms',
        createProxyMiddleware({
            target: 'https://booking-anurakx.onrender.com',
            changeOrigin: true,
            secure: false, 
        })
    );
};
