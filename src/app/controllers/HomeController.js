const User = require('../models/User');

class HomeController {
    index(req, res){
        const id = req.user._id;
        User.findById({_id: id})
        .then(User => {
            User = User.toObject();
            res.render('manageHome', {User});
        })
    }
}

module.exports = new HomeController;