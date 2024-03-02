
module.exports = (req, res, next) => {
    const role = req.cookies['role'];

    if (!role) return res.redirect('/');

    if(role == "Manage"){
        next();
    }
    else{
        res.redirect('/user');
    }
};
