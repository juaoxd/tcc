ALTER TABLE "torneios" ADD COLUMN "quantidade_equipes" integer DEFAULT 4 NOT NULL;
ALTER TABLE "torneios" ADD CONSTRAINT "torneios_quantidade_equipes_check" CHECK ("quantidade_equipes" IN (4, 8, 16));