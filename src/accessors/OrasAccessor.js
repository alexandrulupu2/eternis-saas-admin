const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class OrasAccessor {
  // Preluare toate orasele cu cimitirele lor (Eager Loading)
  static async getAll() {
    return await prisma.oras.findMany({
      include: {
        cimitir: true
      }
    });
  }

  // Preluare oras dupa ID
  static async getById(id) {
    return await prisma.oras.findUnique({
      where: { id_oras: Number(id) },
      include: {
        cimitir: true
      }
    });
  }

  // Salvare oras nou in baza de date
  static async create(nume_oras, judet) {
    return await prisma.oras.create({
      data: {
        nume_oras: nume_oras,
        judet: judet
      }
    });
  }

  // Stergere oras
  static async delete(id) {
    return await prisma.oras.delete({
      where: { id_oras: Number(id) }
    });
  }
}

module.exports = OrasAccessor;