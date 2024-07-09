const roomRouter = require('./room');
const homeRouter = require('./home');
const loginRouter = require('./login');
const ultilityRouter = require('./ultility');
const paymentRouter = require('./payment');
const usermanageRouter = require('./usermanage');
const userRouter = require('./user');
const { verifyToken, authAdmin } = require("../app/middlewares/auth");

function router(app){
    app.use('/room', verifyToken, authAdmin, roomRouter);
    app.use('/ultility', verifyToken, authAdmin, ultilityRouter);
    app.use('/payment',verifyToken, authAdmin, paymentRouter);
    app.use('/usermanage', verifyToken, authAdmin, usermanageRouter);
    app.use('/manage', verifyToken, authAdmin, homeRouter);
    app.use('/user', verifyToken, userRouter);
    app.use('/', loginRouter);
}

module.exports = router;