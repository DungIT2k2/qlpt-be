const User = require('../models/Account')
const Room = require('../models/Room')
const bcrypt = require('bcryptjs')

class usermanageController{
    show(req, res, next){
        User.find({})
        .then(User => {
            User = User.map(User => User.toObject());
            res.render('users/user', {User});
        })
       .catch(next)
    }
    add(req, res, next){
        Room.find({})
            .then(Room => {
                Room = Room.map(Room => Room.toObject());
                res.render('users/add', {Room});
        })
    }
    created(req, res, next){
        const user = new User(req.body);
        User.findOne({username: req.body.username})
        .then(async (User) => {
            if (User){
                res.send('User already exists!')
            }
            else {
                const password = user.password;
                //hash password bcrypt
                const Salt = 10;
                const hashedPassword = await bcrypt.hash(password, Salt);
                user.password = hashedPassword;

                if (user.role == 'Manage'){
                    user.room = "";
                }
                user.save()
                .then(() => res.redirect('/usermanage'))
                .catch(next)
            }
        })
    }
    delete(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/usermanage'))
            .catch(next)
    }
}

module.exports = new usermanageController;