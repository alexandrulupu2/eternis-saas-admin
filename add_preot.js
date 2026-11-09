const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addPreot() {
  const ab = await prisma.abonamente.findFirst();
  const cl = await prisma.clienti.findFirst();

  await prisma.utilizatori.create({
    data: {
      email_utilizator: "parohia.sfapostoli@biserica.ro",
      parola_hash: "parola_secreta_preot",
      rol_utilizator: "USER",
      credite_disponibile: 120,
      id_abonament: ab.id_abonament,
      id_client: cl ? cl.id_client : null
    }
  });

  console.log("Utilizatorul Parohie a fost adaugat cu succes!");
}

addPreot()
  .catch((e) => console.error("Eroare:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });