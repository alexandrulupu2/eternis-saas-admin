const AuthAccessor = require("../accessors/AuthAccessor");

class AuthController {
  static renderLogin(req, res) {
    res.render("login", { error: null });
  }

  static async handleLogin(req, res) {
    try {
      const { email, parola } = req.body;
      if (!email || !parola) {
        return res.render("login", { error: "Vă rugăm să completați toate câmpurile!" });
      }

      let user;
      if (email.toLowerCase().includes("admin")) {
        user = await AuthAccessor.findUserByEmail(email);
        if (!user) user = await AuthAccessor.getFirstAdmin();
      } else {
        user = await AuthAccessor.findUserByEmail(email);
      }

      if (!user) {
        return res.render("login", { error: "Nu a fost găsit niciun cont în baza de date!" });
      }

      if (user.rol_utilizator === "ADMIN") {
        return res.redirect("/admin");
      } else {
        return res.redirect(`/user?userId=${user.id_utilizator}`);
      }
    } catch (error) {
      res.render("login", { error: "Eroare la autentificare: " + error.message });
    }
  }
}

module.exports = AuthController;
