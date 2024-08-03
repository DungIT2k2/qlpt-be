const roomRouter = require('./room');
const homeRouter = require('./home');
const loginRouter = require('./login');
const ultilityRouter = require('./ultility');
const paymentRouter = require('./payment');
const accountRouter = require('./account');
const userRouter = require('./user');
const { verifyToken, authAdmin } = require("../app/middlewares/auth");

function router(app){
    app.use('/room', verifyToken, authAdmin, roomRouter);
    app.use('/ultility', verifyToken, authAdmin, ultilityRouter);
    app.use('/payment',verifyToken, authAdmin, paymentRouter);
    app.use('/account', verifyToken, authAdmin, accountRouter);
    app.use('/manage', verifyToken, authAdmin, homeRouter);
    app.use('/user', verifyToken, userRouter);
    app.use('/', loginRouter);
}

module.exports = router;