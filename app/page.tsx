"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Material-UI Imports
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid2,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState({
    doctorId: '',
    patientName: '',
    date: '',
    type: '',
    notes: ''
  });

  // Fetch logic
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.id) {
      router.push("/auth/signin");
    } else {
      if (session?.user?.role === "Admin") {
        fetchDoctors();
      }
      fetchAppointments();
    }
  }, [session, status]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get("/api/doctors");
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get("/api/appointments", {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  // Create Appointment Handler
  const handleCreateAppointment = async () => {

    const doctorId = session?.user?.role === "Admin"
      ? selectedDoctor?._id
      : session?.user?.id;
    try {
      const appointmentData = {
        doctorId,
        patientName: newAppointmentData.patientName,
        date: newAppointmentData.date,
        type: newAppointmentData.type,
        notes: newAppointmentData.notes
      };

      await axios.post("/api/appointments", appointmentData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      // Reset form and close modal
      setNewAppointmentData({
        doctorId: '',
        patientName: '',
        date: '',
        type: '',
        notes: ''
      });
      setSelectedDoctor(null);
      setIsCreateModalOpen(false);

      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
  };

  // Update Appointment Handler
  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const updateData: any = {
        id: editingAppointment._id,
        update: {
          patientName: editingAppointment.patientName,
          date: editingAppointment.date,
          type: editingAppointment.type,
          notes: editingAppointment.notes
        }
      };

      // If a new doctor is selected, add doctorId to the update
      if (selectedDoctor && selectedDoctor._id !== editingAppointment.doctorId) {
        updateData.update.doctorId = selectedDoctor._id;
      }

      await axios.patch("/api/appointments", updateData, {
        headers: {
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      setEditingAppointment(null);
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment. Please try again.");
    }
  };

  // Delete Appointment Handler
  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await axios.delete('/api/appointments', {
        headers: {
          Id: appointmentId,
          role: session?.user?.role,
          userId: session?.user?.id,
        },
      });

      fetchAppointments();
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  // Loading State
  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header with Sign Out */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Dashboard</Typography>
        {session?.user && (
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Sign Out
          </Button>
        )}
      </Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New Appointment
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Appointment
        </Button>
      </Paper>
      {/* Create Appointment Section for Admin */}


      {/* Appointments Table */}
      <Paper elevation={3}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Appointments
        </Typography>
        {appointments.length === 0 ? (
          <Typography sx={{ p: 2 }}>No appointments available.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setEditingAppointment(appointment);
                            setSelectedDoctor(null);
                          }}
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteAppointment(appointment._id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Appointment Dialog */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2>
              {session?.user?.role === "Admin" && (
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={selectedDoctor?._id || ''}
                    label="Doctor"
                    onChange={(e) => {
                      const doctor = doctors.find(d => d._id === e.target.value);
                      setSelectedDoctor(doctor);
                    }}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor._id} value={doctor._id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              )}

            </Grid2>
            <Grid2 >
              <TextField
                fullWidth
                label="Patient Name"
                value={newAppointmentData.patientName}
                onChange={(e) => setNewAppointmentData({
                  ...newAppointmentData,
                  patientName: e.target.value
                })}
              />
            </Grid2>
            <Grid2 >
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={newAppointmentData.date}
                onChange={(e) => setNewAppointmentData({
                  ...newAppointmentData,
                  date: e.target.value
                })}
              />
            </Grid2>
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 >
              <FormControl fullWidth>
                <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
                <Select
                  labelId="appointment-type-label"
                  value={newAppointmentData.type}
                  onChange={(e) => setNewAppointmentData({
                    ...newAppointmentData,
                    type: e.target.value,
                  })}
                >
                  <MenuItem value="In-Person">In-Person</MenuItem>
                  <MenuItem value="Virtual">Virtual</MenuItem>
                </Select>
              </FormControl>
              </Grid2>
            </Grid2>
            <Grid2>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={newAppointmentData.notes}
                onChange={(e) => setNewAppointmentData({
                  ...newAppointmentData,
                  notes: e.target.value
                })}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAppointment}
            color="primary"
            variant="contained"
          >
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Appointment Dialog */}
      {editingAppointment && (
        <Dialog
          open={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
              {session?.user?.role === "Admin" && (
                <Grid2 >
                  <FormControl fullWidth>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      value={selectedDoctor?._id || editingAppointment.doctorId}
                      label="Doctor"
                      onChange={(e) => {
                        const doctor = doctors.find(d => d._id === e.target.value);
                        setSelectedDoctor(doctor);
                      }}
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor._id} value={doctor._id}>
                          {doctor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid2>
              )}

              <Grid2>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={editingAppointment.patientName}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    patientName: e.target.value
                  })}
                />
              </Grid2>
              <Grid2 >
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  value={
                    editingAppointment.date
                      ? new Date(editingAppointment.date).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    date: e.target.value
                  })}
                />
              </Grid2>
              <Grid2  container spacing={2} sx={{ mt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="edit-appointment-type-label">Appointment Type</InputLabel>
                  <Select
                    labelId="edit-appointment-type-label"
                    value={editingAppointment.type}
                    onChange={(e) => setEditingAppointment({
                      ...editingAppointment,
                      type: e.target.value,
                    })}
                  >
                    <MenuItem value="In-Person">In-Person</MenuItem>
                    <MenuItem value="Virtual">Virtual</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={editingAppointment.notes}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    notes: e.target.value
                  })}
                />
              </Grid2>
            </Grid2>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setEditingAppointment(null);
              setSelectedDoctor(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAppointment}
              color="primary"
              variant="contained"

            >
              Update Appointment
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
} 

