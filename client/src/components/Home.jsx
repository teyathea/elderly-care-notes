import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";
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
  const { state, dispatch, fetchAllNotes, fetchUserNotes, capitalizeSentence } =
    useContext(NotesContext);
  const { notes } = state;
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    fetchAllNotes();

    const fetchSymptoms = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:8000/api/symptoms", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const symptomCounts = res.data.reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(symptomCounts).map((name) => ({
          name,
          count: symptomCounts[name],
        }));

        setSymptoms(chartData);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    };

    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:8000/api/medications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched meds:", res.data);
        setMedications(res.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchSymptoms();
    fetchMedications();
  }, []);

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medications */}
        <div className="border-2 border-black rounded-xl p-4">
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

        {/* Appointments */}
        <div className="border-2 border-black rounded-xl p-4">
          <h2 className="text-orange-400 text-lg font-bold mb-2">
            Upcoming Appointment
          </h2>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Heart Checkup</span>
              <span>05/19/25</span>
            </li>
            <li className="flex justify-between">
              <span>Ear Checkup</span>
              <span>05/19/25</span>
            </li>
            <li className="flex justify-between">
              <span>Laboratory</span>
              <span>05/15/25</span>
            </li>
            <li className="flex justify-between">
              <span>Chest X-ray</span>
              <span>05/16/25</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Notes */}
      <div className="border-2 flex flex-col border-black text-black rounded-xl p-4 mt-4">
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
                <small>{new Date(note.date).toLocaleString()}</small>
              </div>
            ))}
        </div>
      </div>

      {/* Symptoms Chart */}
      <div className="border-2 border-black rounded-xl p-4 mt-4">
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
