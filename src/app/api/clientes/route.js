import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

const LINKEDIN_ACCESS_TOKEN = "AQUPTQUssZD1YPDRyNbdtv_duFkIbjojByS66bj5c_ArdSNKaNSeH3RdwlFCGso9-YJKvPlmMRiLe1Bfy1AwX17Txv7vc5elKi9BGvHXyi5A1qCKz-RDWNGvfAdfhrXbR8Z36vRWQ3HaVO8HR4bzQ8uy43by3AUYGyYMCjzju0ZiErzSHit1E4PcWsHoFLXLx17im1Si4MVujWYR60EFpK7wdEIVkzae-X03L_uQC_itvKB5L-TuA0t6pJlHrcVGF87dg29ZhJERyY8YfykqVH4RWC-s9eiCXNIUi1cbauPUJwKKV_grk51FYS-SQ37KYQKt6AbtQIkJU4kP9qWK1I48ZwZlaw"; // Reemplázalo con tu token real
const LINKEDIN_API_URL = "https://www.linkedin.com/developers/tools/oauth/redirect"; // URL base de LinkedIn API

export async function GET() {
    try {
        const results = await conn.query('SELECT * FROM Clientes');
        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        )
    }


    return NextResponse.json('Listando Clientes');
}

export async function POST(request) {
    try {

        const { IDRespuesta, Nombre, Apellido, Telefono, Campaña, Pais } = await request.json();

        const result = await conn.query("INSERT INTO Clientes SET ?", {
            IDFormulario: IDRespuesta,
            Nombre: Nombre,
            Apellido: Apellido,
            Telefono1: Telefono,
            Oportunidad1: Campaña,
            Pais: Pais,
        });

        console.log(result);

        return NextResponse.json({
            Nombre,
            Apellido,
            Telefono,
            Campaña,
            Pais,
            id: result.insertId,
        });
    }

    catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        )
    }

}

async function fetchLinkedInFormResponses(formId) {
    try {
        const response = await fetch(
            `${LINKEDIN_API_URL}/adForms/${formId}/responses`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error al obtener respuestas: ${response.statusText}`);
        }

        const data = await response.json();
        return data.elements; // Devuelve las respuestas individuales
    } catch (error) {
        console.error("Error en la API de LinkedIn:", error.message);
        throw error;
    }
}

// export async function POST(request) {
//     try {
//         // ID del formulario de LinkedIn Ads (puede recibirse desde el request o configurarse estático)
//         const { formId } = await request.json();

//         if (!formId) {
//             throw new Error("El ID del formulario es obligatorio.");
//         }

//         const responses = await fetchLinkedInFormResponses(formId);

//         if (!responses || responses.length === 0) {
//             return NextResponse.json(
//                 { message: "No se encontraron respuestas en el formulario." },
//                 { status: 404 }
//             );
//         }

//         const insertResults = [];
//         for (const response of responses) {
//             const fields = response.formResponseData.fieldResponses;

//             const Nombre = fields.find((f) => f.fieldId === "firstName")?.value || "";
//             const Apellido = fields.find((f) => f.fieldId === "lastName")?.value || "";
//             const Telefono = fields.find((f) => f.fieldId === "phoneNumber")?.value || "";
//             const Pais = fields.find((f) => f.fieldId === "country")?.value || "";
//             const IDRespuesta = response.id;

//             // Insertar en la base de datos
//             const result = await conn.query("INSERT INTO Clientes SET ?", {
//                 IDFormulario: IDRespuesta,
//                 Nombre: Nombre,
//                 Apellido: Apellido,
//                 Telefono1: Telefono,
//                 Oportunidad1: Campaña,
//                 Pais: Pais,
//             });

//             insertResults.push({
//                 id: result.insertId,
//                 Nombre,
//                 Apellido,
//                 Telefono,
//                 Campaña,
//                 Pais,
//             });
//         }

//         return NextResponse.json({
//             message: "Respuestas insertadas correctamente.",
//             data: insertResults,
//         });
//     } catch (error) {
//         console.error("Error en POST:", error.message);
//         return NextResponse.json(
//             { message: error.message },
//             { status: 500 }
//         );
//     }
// }