CREATE TABLE "equipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipes_usuarios" (
	"id_equipe" uuid,
	"id_usuario" uuid,
	"funcao" text DEFAULT 'PARTICIPANTE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipes_usuarios_id_equipe_id_usuario_pk" PRIMARY KEY("id_equipe","id_usuario")
);
--> statement-breakpoint
ALTER TABLE "equipes_usuarios" ADD CONSTRAINT "equipes_usuarios_id_equipe_equipes_id_fk" FOREIGN KEY ("id_equipe") REFERENCES "public"."equipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipes_usuarios" ADD CONSTRAINT "equipes_usuarios_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;