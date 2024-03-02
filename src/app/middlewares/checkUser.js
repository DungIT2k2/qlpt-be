module.exports = (req, res, next) => {
    const role = req.cookies['role'];

    if (!role) return res.redirect('/');

    if(role == "User"){
        next();
    }
    else{
        res.redirect('/manage');
    }
};
