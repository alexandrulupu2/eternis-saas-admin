-- CreateTable
CREATE TABLE "oras" (
    "id_oras" SERIAL NOT NULL,
    "nume_oras" VARCHAR(100) NOT NULL,

    CONSTRAINT "oras_pkey" PRIMARY KEY ("id_oras")
);

-- CreateTable
CREATE TABLE "cimitir" (
    "id_cimitir" SERIAL NOT NULL,
    "id_oras" INTEGER NOT NULL,
    "locuri_vacante" INTEGER NOT NULL,

    CONSTRAINT "cimitir_pkey" PRIMARY KEY ("id_cimitir")
);

-- CreateTable
CREATE TABLE "clienti" (
    "id_client" SERIAL NOT NULL,
    "nume_client" VARCHAR(50) NOT NULL,
    "prenume_client" VARCHAR(50) NOT NULL,
    "telefon_client" VARCHAR(15),
    "email_client" VARCHAR(100),
    "adresa_client" TEXT,

    CONSTRAINT "clienti_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "decedati" (
    "id_decedat" SERIAL NOT NULL,
    "nume_decedat" VARCHAR(50) NOT NULL,
    "prenume_decedat" VARCHAR(50) NOT NULL,
    "data_nastere_decedat" DATE,
    "data_deces" DATE NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "decedati_pkey" PRIMARY KEY ("id_decedat")
);

-- CreateTable
CREATE TABLE "servicii" (
    "id_serviciu" SERIAL NOT NULL,
    "nume_serviciu" VARCHAR(100) NOT NULL,
    "pret_serviciu" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "servicii_pkey" PRIMARY KEY ("id_serviciu")
);

-- CreateTable
CREATE TABLE "abonamente" (
    "id_abonament" SERIAL NOT NULL,
    "nume_plan" VARCHAR(50) NOT NULL,
    "credite_lunare" INTEGER NOT NULL,
    "pret_simulat" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "abonamente_pkey" PRIMARY KEY ("id_abonament")
);

-- CreateTable
CREATE TABLE "utilizatori" (
    "id_utilizator" SERIAL NOT NULL,
    "id_client" INTEGER,
    "email_utilizator" VARCHAR(100) NOT NULL,
    "parola_hash" VARCHAR(255) NOT NULL,
    "rol_utilizator" VARCHAR(20) NOT NULL,
    "id_abonament" INTEGER NOT NULL,
    "credite_disponibile" INTEGER NOT NULL DEFAULT 0,
    "data_creare" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilizatori_pkey" PRIMARY KEY ("id_utilizator")
);

-- CreateTable
CREATE TABLE "programari" (
    "id_programare" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_decedat" INTEGER NOT NULL,
    "id_cimitir" INTEGER NOT NULL,
    "data_programare" DATE NOT NULL,
    "data_inmormantare" DATE NOT NULL,
    "observatii" TEXT,

    CONSTRAINT "programari_pkey" PRIMARY KEY ("id_programare")
);

-- CreateTable
CREATE TABLE "programari_servicii" (
    "id_programare" INTEGER NOT NULL,
    "id_serviciu" INTEGER NOT NULL,

    CONSTRAINT "programari_servicii_pkey" PRIMARY KEY ("id_programare","id_serviciu")
);

-- CreateTable
CREATE TABLE "conversii_ai" (
    "id_conversie" SERIAL NOT NULL,
    "id_utilizator" INTEGER NOT NULL,
    "id_decedat" INTEGER,
    "tip_conversie" VARCHAR(50) NOT NULL,
    "prompt_input" TEXT NOT NULL,
    "rezultat_output" TEXT NOT NULL,
    "credite_consumate" INTEGER NOT NULL,
    "data_conversie" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversii_ai_pkey" PRIMARY KEY ("id_conversie")
);

-- CreateTable
CREATE TABLE "tranzactii_simulate" (
    "id_tranzactie" SERIAL NOT NULL,
    "id_utilizator" INTEGER NOT NULL,
    "id_abonament" INTEGER NOT NULL,
    "suma_simulata" DECIMAL(10,2) NOT NULL,
    "credite_adaugate" INTEGER NOT NULL,
    "status_tranzactie" VARCHAR(30) NOT NULL,
    "data_tranzactie" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tranzactii_simulate_pkey" PRIMARY KEY ("id_tranzactie")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizatori_email_utilizator_key" ON "utilizatori"("email_utilizator");

-- AddForeignKey
ALTER TABLE "cimitir" ADD CONSTRAINT "cimitir_id_oras_fkey" FOREIGN KEY ("id_oras") REFERENCES "oras"("id_oras") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "decedati" ADD CONSTRAINT "decedati_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clienti"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "utilizatori" ADD CONSTRAINT "utilizatori_id_abonament_fkey" FOREIGN KEY ("id_abonament") REFERENCES "abonamente"("id_abonament") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "utilizatori" ADD CONSTRAINT "utilizatori_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clienti"("id_client") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clienti"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_id_decedat_fkey" FOREIGN KEY ("id_decedat") REFERENCES "decedati"("id_decedat") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_id_cimitir_fkey" FOREIGN KEY ("id_cimitir") REFERENCES "cimitir"("id_cimitir") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "programari_servicii" ADD CONSTRAINT "programari_servicii_id_programare_fkey" FOREIGN KEY ("id_programare") REFERENCES "programari"("id_programare") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "programari_servicii" ADD CONSTRAINT "programari_servicii_id_serviciu_fkey" FOREIGN KEY ("id_serviciu") REFERENCES "servicii"("id_serviciu") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversii_ai" ADD CONSTRAINT "conversii_ai_id_utilizator_fkey" FOREIGN KEY ("id_utilizator") REFERENCES "utilizatori"("id_utilizator") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversii_ai" ADD CONSTRAINT "conversii_ai_id_decedat_fkey" FOREIGN KEY ("id_decedat") REFERENCES "decedati"("id_decedat") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tranzactii_simulate" ADD CONSTRAINT "tranzactii_simulate_id_abonament_fkey" FOREIGN KEY ("id_abonament") REFERENCES "abonamente"("id_abonament") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tranzactii_simulate" ADD CONSTRAINT "tranzactii_simulate_id_utilizator_fkey" FOREIGN KEY ("id_utilizator") REFERENCES "utilizatori"("id_utilizator") ON DELETE NO ACTION ON UPDATE NO ACTION;
