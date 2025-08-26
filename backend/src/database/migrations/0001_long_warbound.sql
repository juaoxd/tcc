CREATE TABLE "torneios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"esporte" text DEFAULT 'FUTEBOL' NOT NULL,
	"id_administrador" uuid,
	"inicio" timestamp,
	"fim" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "torneios" ADD CONSTRAINT "torneios_id_administrador_usuarios_id_fk" FOREIGN KEY ("id_administrador") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;