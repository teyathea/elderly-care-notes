import axios from "axios";
import { useEffect, useContext } from "react";
import { NotesContext } from "../context/NotesContext";

export default function Home() {
    const {state, dispatch, fetchAllNotes, fetchUserNotes, capitalizeSentence} = useContext(NotesContext)
    const {notes} = state

    useEffect(() => {
    fetchAllNotes(); // fetch all notes
}, []);


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black rounded-xl p-4">
                    <h2 className="text-orange-400 text-lg font-bold mb-2">
                        Meds of the day
                    </h2>
                    <ul className="space-y-1">
                        <li>6AM - Metformin</li>
                        <li>12NN - Telmisartan</li>
                        <li>6PM - Melatonin</li>
                    </ul>
                </div>

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
{/* NOTES */}
            <div className="border-2 flex flex-col border-black  text-black rounded-xl p-4 mt-4">
                <h2 className="flex justify-center font-semibold mb-2">Notes</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-none outline-none resize-none h-40 overflow-y-auto space-y-2">
                    {[...notes]
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest
                        .slice(0, 6) // Show only the latest 6 notes 
                        .map((note) => (
                            <div key={note._id} className="bg-green-200 p-2">
                                <h3 className="capitalize font-semibold">Title: {note.title}</h3>
                                <p>{capitalizeSentence(note.description)}</p>
                                <small>{new Date(note.date).toLocaleString()}</small>
                            </div>
                        ))}
                </div>
            </div>

            <div className="border-2 border-black rounded-xl p-4 mt-4">
                <h2 className="text-orange-400 text-lg font-bold mb-4 text-center">
                    Graph
                </h2>
                <div className="flex items-end justify-around h-40">
                    <div className="bg-blue-500 w-8 h-20"></div>
                    <div className="bg-pink-400 w-8 h-10"></div>
                    <div className="bg-orange-500 w-8 h-28"></div>
                    <div className="bg-green-400 w-8 h-16"></div>
                </div>

                <div className="flex justify-around text-sm mt-2 text-black">
                    <span>Metformin</span>
                    <span>Rabies</span>
                    <span>Dogs</span>
                    <span>Cats</span>
                </div>
            </div>
        </>
    );
}
