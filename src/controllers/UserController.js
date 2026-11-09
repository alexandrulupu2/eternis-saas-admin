const UserAccessor = require("../accessors/UserAccessor");

class UserController {
  // Afiseaza dashboard-ul preotului cu planurile si controalele speciale
  static async dashboard(req, res) {
    try {
      // Simulam preotul conectat (ex: ID #2 create in baza de date)
      const userId = req.query.userId || 2; 
      const user = await UserAccessor.getUserProfile(userId);

      if (!user) {
        return res.status(404).send("Utilizatorul nu a fost gasit.");
      }

      res.render("user/dashboard", { user });
    } catch (error) {
      res.status(500).send("Eroare la incarcarea paginii preotului: " + error.message);
    }
  }

  // API Call - Generare text AI si consumare credit
  static async generateAiContent(req, res) {
    try {
      const { userId, tip_text, tema } = req.body;

      // 1. Scadem creditul din DB
      const updatedUser = await UserAccessor.consumeCredit(userId);

      // 2. Simulam raspunsul de la un Serviciu API de Inteligență Artificială
      let raspunsAi = "";
      if (tip_text === "predica") {
        raspunsAi = `[Generat AI Eternis] Predică despre "${tema}": Iubiți credincioși, învățătura de astăzi ne aduce aminte de importanța credinței, a răbdării și a iubirii de semeni...`;
      } else if (tip_text === "necrolog") {
        raspunsAi = `[Generat AI Eternis] Necrolog / Cuvânt de rămas bun pentru "${tema}": Cu adâncă durere în suflet, ne despărțim astăzi de cel ce a fost un stâlp al familiei și al comunității noastre...`;
      } else {
        raspunsAi = `[Generat AI Eternis] Anunț Parohial: Vă informăm cu drag cu privire la evenimentul "${tema}" care va avea loc în parohia noastră...`;
      }

      res.json({
        success: true,
        text: raspunsAi,
        crediteRamase: updatedUser.credite_disponibile
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserController;