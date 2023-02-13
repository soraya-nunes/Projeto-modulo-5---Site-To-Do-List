module.exports.checkAuth = function (req, res, next) {

    const UserId = req.session.userid;

    if (!UserId) {
        console.log('id: ', UserId)
    //     res.redirect('/login')
    }
    next()
}