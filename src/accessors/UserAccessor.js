const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserAccessor {
  // Preluam datele preotului si abonamentul sau
  static async getUserProfile(userId) {
    return await prisma.utilizatori.findUnique({
      where: { id_utilizator: Number(userId) },
      include: { abonamente: true }
    });
  }

  // Scadem 1 credit AI cand preotul genereaza un text
  static async consumeCredit(userId) {
    const user = await prisma.utilizatori.findUnique({
      where: { id_utilizator: Number(userId) }
    });

    if (!user || user.credite_disponibile <= 0) {
      throw new Error("Nu mai ai credite AI disponibile! Contacteaza administratorul.");
    }

    return await prisma.utilizatori.update({
      where: { id_utilizator: Number(userId) },
      data: { credite_disponibile: { decrement: 1 } }
    });
  }
}

module.exports = UserAccessor;