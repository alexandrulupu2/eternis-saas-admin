-- AlterTable
ALTER TABLE "cimitir" ADD COLUMN     "adresa" VARCHAR(255);

-- AlterTable
ALTER TABLE "oras" ADD COLUMN     "judet" VARCHAR(50);

-- CreateTable
CREATE TABLE "parcela_cimitir" (
    "id_parcela" SERIAL NOT NULL,
    "numar_parcela" VARCHAR(50) NOT NULL,
    "capacitate" INTEGER NOT NULL DEFAULT 1,
    "id_cimitir" INTEGER NOT NULL,

    CONSTRAINT "parcela_cimitir_pkey" PRIMARY KEY ("id_parcela")
);

-- AddForeignKey
ALTER TABLE "parcela_cimitir" ADD CONSTRAINT "parcela_cimitir_id_cimitir_fkey" FOREIGN KEY ("id_cimitir") REFERENCES "cimitir"("id_cimitir") ON DELETE CASCADE ON UPDATE CASCADE;
