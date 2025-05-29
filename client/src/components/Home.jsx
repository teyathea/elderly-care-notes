import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const navigate = useNavigate();
  const { state, fetchAllNotes, capitalizeSentence } = useContext(NotesContext);
  const { notes } = state;
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check user role and redirect accordingly
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
      // Admin sees everything, no redirect needed
      return;
    } else if (userRole === "caregiver") {
      navigate("/notesfeed"); // Caregivers primarily work with notes
    } else if (userRole === "family") {
      navigate("/medical-records"); // Family members primarily check medical records
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        // Fetch symptoms
        const symptomsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/symptoms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const symptomCounts = symptomsRes.data.reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(symptomCounts).map((name) => ({
          name,
          count: symptomCounts[name],
        }));

        setSymptoms(chartData);

        // Fetch medications
        const medsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/medications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedications(medsRes.data);

        // Fetch upcoming appointments
        const appointmentsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/appointments/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpcomingAppointments(appointmentsRes.data);

        // Fetch notes
        fetchAllNotes();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only run once on mount

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medications - Clickable */}
        <div 
          className="border-2 border-black rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/medications')}
        >
          <h2 className="text-orange-400 text-lg font-bold mb-2">
            Meds of the day
          </h2>
          <ul className="space-y-1">
            {medications.length === 0 ? (
              <li>No medications found.</li>
            ) : (
              medications
                .filter((med) => med.day.toLowerCase() === today)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((med) => (
                  <li key={med._id}>
                    {med.time} - {med.medicine} -{" "}
                    {new Date(med.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </li>
                ))
            )}
          </ul>
        </div>

        {/* Appointments - Clickable */}
        <div 
          className="border-2 border-black rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/appointments')}
        >
          <h2 className="text-orange-400 text-lg font-bold mb-2">
            Upcoming Appointments
          </h2>
          <ul className="space-y-1">
            {upcomingAppointments.length === 0 ? (
              <li>No upcoming appointments.</li>
            ) : (
              upcomingAppointments.map((appointment) => (
                <li key={appointment._id} className="flex justify-between items-start py-1">
                  <div>
                    <div className="font-semibold">{appointment.title}</div>
                    <div className="text-sm text-gray-600">{appointment.location}</div>
                  </div>
                  <div className="text-right">
                    <div>{new Date(appointment.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">{appointment.time}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Notes - Clickable */}
      <div 
        className="border-2 flex flex-col border-black text-black rounded-xl p-4 mt-4 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => navigate('/notesfeed')}
      >
        <h2 className="flex justify-center font-semibold mb-2">Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
          {[...notes]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6)
            .map((note) => (
              <div key={note._id} className="bg-green-200 p-2">
                <h3 className="capitalize font-semibold">
                  Title: {note.title}
                </h3>
                <p>{capitalizeSentence(note.description)}</p>
                <div>
                  {note.created_by && (
                    <small className="text-black capitalize">
                      By: {note.created_by.fullname}
                    </small>
                  )}
                </div>
                

                <small>{new Date(note.date).toLocaleString()}</small>
              </div>
            ))}
        </div>
      </div>

      {/* Symptoms Chart - Clickable */}
      <div 
        className="border-2 border-black rounded-xl p-4 mt-4 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => navigate('/symptom-tracker')}
      >
        <h2 className="text-orange-400 text-lg font-bold mb-4">
          Symptoms Chart
        </h2>
        {symptoms.length === 0 ? (
          <p className="text-gray-500">No data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={symptoms}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
