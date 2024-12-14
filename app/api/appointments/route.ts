import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectdb";
import Appointment from "@/models/Appointments";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    const role = req.headers.get('role');
    const userId = req.headers.get('userId');

    if (!role || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        if (role === "Admin") {
            const appointments = await Appointment.find();
          
            return NextResponse.json(appointments);
        } else if (role === "Doctor") {
            const appointments = await Appointment.find({ doctorId: userId });
          
            return NextResponse.json(appointments);
        }

        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const role = req.headers.get('role');
    const userId = req.headers.get('userId');
    
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const body = await req.json();

        let { patientName, doctorId, date, type } = body;

      console.log(patientName, doctorId, date, type,"log")

        if (!patientName || !doctorId || !date || !type) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        const result = await Appointment.create({
            ...body,
            doctorId, // Ensure doctorId is the correct one
            date: new Date(date),
            createdBy: userId,
            doctorName: doctor.name || doctor.fullName || 'Unknown Doctor' // Adjust the field name based on your User model
        });

        return NextResponse.json({ success: true, id: result._id });
    } catch (error: any) {
        console.error('Full error:', error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    const role = req.headers.get('role');
    const userId = req.headers.get('userId');
    const id = req.headers.get('Id');
    if (!userId || !id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await connectDB()
        const result = await Appointment.deleteOne({
            _id: id,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function PATCH(req: NextRequest) {
    const role = req.headers.get('role');
    const userId = req.headers.get('userId');
    const body = await req.json();
    
    if ( !userId || !body.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        await connectDB();
        
        // If doctorId is being updated, also update the doctorName
        if (body.update.doctorId) {
            const doctor = await User.findById(body.update.doctorId);
            if (!doctor) {
                return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
            }
            
            // Add doctorName to the update if doctorId is changed
            body.update.doctorName = doctor.name || doctor.fullName || 'Unknown Doctor';
        }
        
        const result = await Appointment.updateOne(
            { _id: body.id },
            { $set: body.update }
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}