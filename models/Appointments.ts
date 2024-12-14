import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true }, // New field to store doctor's name
    date: { type: Date, required: true },
    type: { type: String, required: true,enum : ["In-Person", "Virtual"] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Appointment = 
  mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);

export default Appointment;