const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Se populeaza datele...");

  const orasBuc = await prisma.oras.create({
    data: {
      nume_oras: "Bucuresti",
      judet: "Bucuresti",
      cimitir: {
        create: [
          {
            locuri_vacante: 120,
            adresa: "Calea Serban Voda nr. 249",
            parcele: {
              create: [
                { numar_parcela: "A-101", capacitate: 2 },
                { numar_parcela: "A-102", capacitate: 1 }
              ]
            }
          }
        ]
      }
    },
    include: {
      cimitir: {
        include: { parcele: true }
      }
    }
  });

  const cimitirBuc = orasBuc.cimitir[0];

  const servInhumare = await prisma.servicii.create({
    data: {
      nume_serviciu: "Serviciu Inhumare Standard",
      pret_serviciu: 1500.00
    }
  });

  const servCapela = await prisma.servicii.create({
    data: {
      nume_serviciu: "Inchiriere Capela",
      pret_serviciu: 450.00
    }
  });

  const abonamentPremium = await prisma.abonamente.create({
    data: {
      nume_plan: "Plan Premium Eternis",
      credite_lunare: 100,
      pret_simulat: 49.99
    }
  });

  const clientPopescu = await prisma.clienti.create({
    data: {
      nume_client: "Popescu",
      prenume_client: "Ion",
      telefon_client: "0722111222",
      email_client: "ion.popescu@email.com",
      adresa_client: "Strada Victoriei nr. 10, Bucuresti"
    }
  });

  const userAdmin = await prisma.utilizatori.create({
    data: {
      id_client: clientPopescu.id_client,
      email_utilizator: "admin@eternis.ro",
      parola_hash: "$2b$10$w8T0Z1YmYx7/fakehashsecretadmin",
      rol_utilizator: "ADMIN",
      id_abonament: abonamentPremium.id_abonament,
      credite_disponibile: 80
    }
  });

  await prisma.tranzactii_simulate.create({
    data: {
      id_utilizator: userAdmin.id_utilizator,
      id_abonament: abonamentPremium.id_abonament,
      suma_simulata: 49.99,
      credite_adaugate: 100,
      status_tranzactie: "CONFIRMAT"
    }
  });

  const decedatPopescu = await prisma.decedati.create({
    data: {
      nume_decedat: "Popescu",
      prenume_decedat: "Vasile",
      data_nastere_decedat: new Date("1945-03-15"),
      data_deces: new Date("2026-09-10"),
      id_client: clientPopescu.id_client
    }
  });

  await prisma.conversii_ai.create({
    data: {
      id_utilizator: userAdmin.id_utilizator,
      id_decedat: decedatPopescu.id_decedat,
      tip_conversie: "BIOGRAFIE_OMAGIALA",
      prompt_input: "Genereaza o biografie comemorativa pentru bunicul Vasile",
      rezultat_output: "In memoria lui Vasile Popescu, om harnic si devotat familiei...",
      credite_consumate: 5
    }
  });

  const programare1 = await prisma.programari.create({
    data: {
      id_client: clientPopescu.id_client,
      id_decedat: decedatPopescu.id_decedat,
      id_cimitir: cimitirBuc.id_cimitir,
      data_programare: new Date("2026-09-11"),
      data_inmormantare: new Date("2026-09-14"),
      observatii: "Ceremonie cu slujba la capela"
    }
  });

  await prisma.programari_servicii.createMany({
    data: [
      {
        id_programare: programare1.id_programare,
        id_serviciu: servInhumare.id_serviciu
      },
      {
        id_programare: programare1.id_programare,
        id_serviciu: servCapela.id_serviciu
      }
    ]
  });

  console.log("Toate tabelele au fost populate cu succes!");
}

main()
  .catch((e) => {
    console.error("Eroare la populare:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });