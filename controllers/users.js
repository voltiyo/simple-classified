const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, "g-recaptcha-response": token } = req.body;
    const secretKey = "6LeTZsMqAAAAAP23kvJhgmrL63MwaxxOvs6MbU4k";
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;


    const response = await fetch(verificationUrl, { method: "POST" });
    const data = await response.json();

    console.log(data.success)
    if (!data.success){
      req.flash("error", "Captcha validation failed. Please try again.")
      return res.redirect("register");
    }
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Simple Classified!");
      res.redirect("/ads");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/ads";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/ads");
  });
};
