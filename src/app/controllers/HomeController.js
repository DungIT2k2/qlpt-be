class HomeController {
    index(req, res){
        res.render('manageHome');
    }
}

module.exports = new HomeController;