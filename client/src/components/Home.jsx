import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { NotesContext } from "../context/NotesContext";

export default function Home() {
    const {state, dispatch, fetchNotes} = useContext(NotesContext)
    const {notes} = state

    useEffect(() => {
    fetchNotes();
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

            <div className="border-2 border-black rounded-xl p-4 mt-4">
                <h2 className="text-black font-semibold mb-2">Notes:</h2>
                <div className="w-full bg-transparent text-black border-none outline-none resize-none h-24">
                    {notes.map((note) => {
                        return (
                        <div key={note._id} >
                            <h3>{note.title}</h3>
                            <p>{note.description}</p>
                            <small>{new Date(note.date).toLocaleString()}</small>
                        </div>
                        )
                    })}
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
