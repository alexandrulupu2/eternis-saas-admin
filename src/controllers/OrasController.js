const OrasAccessor = require("../accessors/OrasAccessor");

class OrasController {
  // Actiune: Afiseaza pagina cu tabelul de orase (View-ul index)
  static async index(req, res) {
    try {
      const orase = await OrasAccessor.getAll();
      res.render("orase/index", { orase });
    } catch (error) {
      res.status(500).send("Eroare la incarcarea oraselor: " + error.message);
    }
  }

  // Actiune: Afiseaza formularul de adaugare (View-ul add)
  static renderAddForm(req, res) {
    res.render("orase/add");
  }

  // Actiune: Preia datele din formular si le trimite Accesorului pentru salvare
  static async store(req, res) {
    try {
      const { nume_oras, judet } = req.body;
      if (!nume_oras) {
        return res.status(400).send("Numele orasului este obligatoriu.");
      }
      await OrasAccessor.create(nume_oras, judet);
      res.redirect("/orase");
    } catch (error) {
      res.status(500).send("Eroare la salvare: " + error.message);
    }
  }

  // Actiune: Sterge un oras
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      await OrasAccessor.delete(id);
      res.redirect("/orase");
    } catch (error) {
      res.status(500).send("Eroare la stergere: " + error.message);
    }
  }
}

module.exports = OrasController;