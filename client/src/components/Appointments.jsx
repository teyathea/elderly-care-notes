import React, { useState } from 'react';
import '../styles/Global.css';
import AppointmentModal from '../components/modals/AppointmentsModal';

// Setup month and day names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Setup days of the week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AppointmentPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create an array to hold the days of the month
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // handle date click to open modal
  const handleDateClick = (day) => {
    if (!day) return; // ignore empty slots
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDay(dateStr);
    setShowModal(true);
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => app.date === date);
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen" style={{ backgroundColor: 'var(--light)' }}>
      <h1 className="text-3xl font-bold mb-6 mr-70 ml-70" style={{ color: 'var(--primary)' }}>Appointments</h1>

      <div
        className="w-full max-w-7xl border-2 rounded-xl p-6"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'white' }}
      >
        {/* Month & Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth}>Prev</button>

          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            {monthNames[month]} {year}
          </h2>

          <button onClick={handleNextMonth}>Next</button>
        </div>

        {/* Days of Week Header */}
        <div
          className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold"
          style={{ color: 'var(--primary)' }}
        >
          {daysOfWeek.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysArray.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={index}
                  className="p-4 border rounded calendar-day"
                  style={{ borderColor: 'var(--accent)' }}
                  onClick={() => handleDateClick(day)}
                >

                </div>
              );
            }

            // Format the date string for appointments e.g. "2025-10-01"
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayAppointments = getAppointmentsForDate(dateStr);

            return (
              <div
                key={index}
                className="p-4 border rounded cursor-pointer transition "
                style={{ borderColor: 'var(--accent)', color: 'var(--primary)', backgroundColor: 'white' }}
                onClick={() => handleDateClick(day)}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--medium)';
                  e.currentTarget.style.color = 'var(--secondary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
              >
                <div className="font-semibold">{day}</div>
                <ul className="text-sm mt-1 max-h-20 overflow-y-auto">
                  {dayAppointments.map(app => (
                    <li key={app.id} className="truncate" title={app.title}>
                      {app.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          date={selectedDay}
          appointments={getAppointmentsForDate(selectedDay)}
          setAppointments={setAppointments}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentPage;