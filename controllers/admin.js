
module.exports.renderLogin = (req, res) => {
  res.render("admin/login");
};

module.exports.login = (req, res) => {
  req.flash("AdminUser", true)
  req.flash("success", "welcome back!");
  const redirectUrl = "/admin/dashboard";
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/admin/login");
  });
};
