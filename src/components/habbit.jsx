import React, { useState, useEffect } from 'react';

const habits = ['Workout', 'Read', 'Code', 'Meditate'];

// Function to get all days in the current month
const getDaysInMonth = (year, month) => {
  return new Array(new Date(year, month + 1, 0).getDate())
    .fill(null)
    .map((_, idx) => idx + 1); // Get dates from 1 to the last day of the month
};

const HabitTracker = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const days = getDaysInMonth(year, month); // Get all days in the current month

  // State to store habit data
  const [habitData, setHabitData] = useState(() => {
    const saved = localStorage.getItem('habitData');
    return saved ? JSON.parse(saved) : {}; // Load from localStorage or use empty object
  });

  // Save habit data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('habitData', JSON.stringify(habitData));
  }, [habitData]);

  // Toggle habit completion for a given day and habit
  const toggleHabit = (day, habit) => {
    const key = `${year}-${month + 1}-${day}`;
    setHabitData(prev => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = {}; // Initialize if not present
      updated[key][habit] = !updated[key][habit]; // Toggle habit completion
      return updated;
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Habit Tracker - {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>
      <table className="table-auto border w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            {habits.map(habit => (
              <th key={habit} className="border px-2 py-1">{habit}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => {
            const dateKey = `${year}-${month + 1}-${day}`; // Unique key for each date
            return (
              <tr key={day} className={day === today.getDate() ? 'bg-yellow-100' : ''}>
                <td className="border px-2 py-1">{day}</td>
                {habits.map(habit => (
                  <td key={habit} className="border px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={habitData[dateKey]?.[habit] || false} // Checked based on habitData
                      onChange={() => toggleHabit(day, habit)} // Toggle habit status
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTracker;
