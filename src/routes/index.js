const roomRouter = require('./room');
const homeRouter = require('./home');
const loginRouter = require('./login');
const ultilityRouter = require('./ultility');
const paymentRouter = require('./payment');
const usermanageRouter = require('./usermanage');
const userRouter = require('./user');
const checkAdmin = require('../app/middlewares/checkAdmin');
const checkUser = require('../app/middlewares/checkUser');

function router(app){
    app.use('/room', checkAdmin, roomRouter);
    app.use('/ultility',checkAdmin, ultilityRouter);
    app.use('/payment',checkAdmin, paymentRouter);
    app.use('/usermanage',checkAdmin, usermanageRouter);
    app.use('/manage',checkAdmin, homeRouter);
    app.use('/user',checkUser, userRouter);
    app.use('/', loginRouter);
}

module.exports = router;