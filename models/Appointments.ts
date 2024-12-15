


import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true }, // Patient's age
    patientGender: { type: String, required: true, enum: ["Male", "Female", "Other"] }, // Gender
    reasonForVisit: { type: String, required: true }, // Reason for appointment

    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true }, // Doctor's name
    
    date: { type: Date, required: true },
    type: { type: String, required: true, enum: ["In-Person", "Virtual"] },
    notes: { type: String, default: "" }, // Optional notes
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
