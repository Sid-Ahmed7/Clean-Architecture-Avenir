import { EmailService } from "@/lib/email/email-service";
import { contactSchemaServer } from "@/lib/validation/contactSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
    try{
        if (!EmailService.validateConfig()) {
            return NextResponse.json(
                { error: "Configuration email invalide" },
                { status: 500 }
            );
            }

        const data  = await request.json();

        const parsed = contactSchemaServer.parse(data);

        const result = await EmailService.sendContactEmail(parsed);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Erreur lors de l'envoi" },
                { status: 500 }
            );
            }

            return NextResponse.json(
            {
                message: "Message envoyé avec succès",
                id: result.id,
            },
            { status: 200 }
            );
        } catch (error) {
            console.error("Erreur dans la route API:", error);
                if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite" },
      { status: 500 }
    );
    }
}