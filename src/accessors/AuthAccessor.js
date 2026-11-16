const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AuthAccessor {
  static async findUserByEmail(email) {
    return await prisma.utilizatori.findFirst({
      where: { email_utilizator: email },
      include: { abonamente: true }
    });
  }
}

module.exports = AuthAccessor;