const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminAccessor {
  static async getOverviewStats() {
    const totalUtilizatori = await prisma.utilizatori.count({
      where: { rol_utilizator: { not: "ADMIN" } }
    });
    const totalClienti = await prisma.clienti.count();
    const totalProgramari = await prisma.programari.count();
    const totalCimitire = await prisma.cimitir.count();
    return { totalUtilizatori, totalClienti, totalProgramari, totalCimitire };
  }

  static async getAllUsersWithRelations() {
    return await prisma.utilizatori.findMany({
      where: { rol_utilizator: { not: "ADMIN" } },
      include: {
        abonamente: true
      },
      orderBy: { id_utilizator: "asc" }
    });
  }

  static async getAbonamente() {
    return await prisma.abonamente.findMany({
      orderBy: { id_abonament: "asc" }
    });
  }

  static async createUser(data) {
    const abonamentAles = await prisma.abonamente.findUnique({
      where: { id_abonament: Number(data.id_abonament) }
    });

    const creditePlan = abonamentAles ? abonamentAles.credite_lunare : 0;
    const parolaHash = `$hash_${Buffer.from(data.parola).toString("base64")}`;

    return await prisma.utilizatori.create({
      data: {
        email_utilizator: data.email,
        parola_hash: parolaHash,
        rol_utilizator: "USER",
        id_abonament: Number(data.id_abonament),
        credite_disponibile: creditePlan,
        id_client: null
      }
    });
  }

  // Adauga credite bonus peste cele existente
  static async addBonusCredits(id, crediteBonus) {
    return await prisma.utilizatori.update({
      where: { id_utilizator: Number(id) },
      data: {
        credite_disponibile: {
          increment: Number(crediteBonus)
        }
      }
    });
  }

  static async deleteUser(id) {
    return await prisma.utilizatori.delete({
      where: { id_utilizator: Number(id) }
    });
  }
}

module.exports = AdminAccessor;