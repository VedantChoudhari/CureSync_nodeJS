// Example API base URL
const API_BASE = "http://localhost:3000";

// Fetch patient appointments
async function loadPatientAppointments() {
  try {
    const res = await fetch(`${API_BASE}/appointments`);
    const data = await res.json();
    const container = document.getElementById("appointments");
    container.innerHTML = "<h2>Your Appointments</h2><ul>" +
      data.map(a => `<li>${a.appointmentDate} - Doctor ID: ${a.doctorId}</li>`).join("") +
      "</ul>";
  } catch (err) {
    console.error("Error loading appointments", err);
  }
}

// Fetch doctor appointments
async function loadDoctorAppointments() {
  try {
    const res = await fetch(`${API_BASE}/appointments?role=doctor`);
    const data = await res.json();
    const container = document.getElementById("doctor-appointments");
    container.innerHTML = "<h2>Doctor Appointments</h2><ul>" +
      data.map(a => `<li>${a.appointmentDate} - Patient ID: ${a.userId}</li>`).join("") +
      "</ul>";
  } catch (err) {
    console.error("Error loading doctor appointments", err);
  }
}

// Fetch hospital OPDs
async function loadHospitalOPDs() {
  try {
    const res = await fetch(`${API_BASE}/opds`);
    const data = await res.json();
    const container = document.getElementById("opds");
    container.innerHTML = "<h2>Hospital OPDs</h2><ul>" +
      data.map(o => `<li>${o.name} - Doctor ID: ${o.doctorId}</li>`).join("") +
      "</ul>";
  } catch (err) {
    console.error("Error loading OPDs", err);
  }
}
