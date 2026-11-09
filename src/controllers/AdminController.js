const AdminAccessor = require("../accessors/AdminAccessor");

class AdminController {
  static async dashboard(req, res) {
    try {
      const stats = await AdminAccessor.getOverviewStats();
      const utilizatori = await AdminAccessor.getAllUsersWithRelations();
      res.render("admin/dashboard", { stats, utilizatori });
    } catch (error) {
      res.status(500).send("Eroare la incarcarea panoului: " + error.message);
    }
  }

  static async renderAddUser(req, res) {
    try {
      const abonamente = await AdminAccessor.getAbonamente();
      res.render("admin/add-user", { abonamente });
    } catch (error) {
      res.status(500).send("Eroare la incarcarea formularului: " + error.message);
    }
  }

  // Afiseaza formularul de editare precompletat
  static async renderEditUser(req, res) {
    try {
      const user = await AdminAccessor.getUserById(req.params.id);
      const abonamente = await AdminAccessor.getAbonamente();
      res.render("admin/edit-user", { user, abonamente });
    } catch (error) {
      res.status(500).send("Eroare la incarcarea formularului de editare: " + error.message);
    }
  }

  static async storeUser(req, res) {
    try {
      await AdminAccessor.createUser(req.body);
      res.redirect("/admin");
    } catch (error) {
      res.status(500).send("Eroare la inrolarea utilizatorului: " + error.message);
    }
  }

  // Salveaza modificarile
  static async updateUser(req, res) {
    try {
      await AdminAccessor.updateUser(req.params.id, req.body);
      res.redirect("/admin");
    } catch (error) {
      res.status(500).send("Eroare la actualizare: " + error.message);
    }
  }

  static async addCredits(req, res) {
    try {
      const { id } = req.params;
      const { credite_bonus } = req.body;
      if (credite_bonus && Number(credite_bonus) > 0) {
        await AdminAccessor.addBonusCredits(id, credite_bonus);
      }
      res.redirect("/admin");
    } catch (error) {
      res.status(500).send("Eroare la alocarea creditelor: " + error.message);
    }
  }

  static async destroyUser(req, res) {
    try {
      await AdminAccessor.deleteUser(req.params.id);
      res.redirect("/admin");
    } catch (error) {
      res.status(500).send("Eroare la stergere: " + error.message);
    }
  }
}

module.exports = AdminController;