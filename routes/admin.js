const express = require('express');
const router = express.Router();
const passport = require('passport');
const admin = require('../controllers/admin');
const ads = require("../controllers/ads")
const Ad = require("../models/ads")

const ADMIN = {
    login: async (req, res) => {
        req.session.adminuser = req.user.username;
        res.redirect("/admin/dashboard");
    },
    renderLogin: (req, res) => {
        res.render('admin/login'); // Render login form
    }
};
router.route('/login')
    .get(admin.renderLogin)
    .post(passport.authenticate('admin', { failureFlash: true, failureRedirect: '/admin/login' }), ADMIN.login,admin.login);
    
router.get("/dashboard",  async (req, res) => {
    const adminuser = req.session.adminuser;
    const adsList = await ads.ShowAll(req, res);
    if (adminuser !== undefined){
        res.render("admin/dashboard",{ 
            AdminUser: adminuser,
            ads: adsList
        })
    } else { 
        req.flash("error", "You must sign in")
        res.redirect("/admin/login")
    }
})

router.post("/ads/delete/:id", async (req,res) => {
    const AdId = req.params.id
    await Ad.findByIdAndDelete(AdId);
    req.flash("success", "Successfully deleted Ad");
    res.redirect("/admin/dashboard");
})

router.get('/logout', admin.logout)

module.exports = router;