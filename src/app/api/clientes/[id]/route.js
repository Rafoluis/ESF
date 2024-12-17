import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const result = await conn.query("SELECT * FROM Clientes WHERE IDCliente = ?", [id]);

        if (result.length === 0) {
            return NextResponse.json(
                {
                    message: "Cliente no encontrado",
                },
                {
                    status: 404,
                }
            )
        }

        return NextResponse.json(result[0]);
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
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const result = await conn.query("DELETE FROM Clientes WHERE IDCliente = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: "Clientes no encontrado",
                },
                {
                    status: 404,
                }
            )
        }

        return new Response(null, {
            status: 204
        })
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 400,
            }
        )
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { id } = await params;
        const result = await conn.query("UPDATE Clientes SET ? WHERE IDCliente = ?", [data, id]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: "Clientes no encontrado",
                },
                {
                    status: 404,
                }
            );
        }

        const updatedClients = await conn.query("SELECT * FROM Clientes WHERE IDCliente = ?", [id]);
        return NextResponse.json(updatedClients[0]);
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message
            },
            {
                status: 500
            }
        );
    }
}