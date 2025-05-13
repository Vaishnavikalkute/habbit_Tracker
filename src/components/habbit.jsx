import React, { useState, useEffect } from 'react';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push({
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const HabitTracker = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [
      { name: 'Research paper', goal: 2 },
      { name: 'read 2 pages work on startup', goal: 31 },
      { name: 'DSA', goal: 31 },
    ];
  });
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('habitData');
    return saved ? JSON.parse(saved) : {};
  });

  const days = getDaysInMonth(year, month);

  useEffect(() => {
    localStorage.setItem('habitData', JSON.stringify(data));
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [data, habits]);

  const toggleCheck = (habitName, day) => {
    const key = `${year}-${month + 1}-${day}`;
    setData(prev => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = {};
      updated[key][habitName] = !updated[key][habitName];
      return updated;
    });
  };

  const getAchieved = habitName => {
    return Object.values(data).reduce((acc, dayData) => {
      return acc + (dayData[habitName] ? 1 : 0);
    }, 0);
  };

  const handleAddHabit = () => {
    const newHabit = prompt('Enter new habit name:');
    const goal=prompt("Enter the goal")
    if (newHabit) {
      setHabits(prev => [...prev, { name: newHabit, goal: goal }]);
    }
  };

  const prevMonth = () => {
    setMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear(prev => prev - 1);
  };

  const nextMonth = () => {
    setMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear(prev => prev + 1);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-xl">&lt;</button>
        <h2 className="text-xl font-bold">
          {new Date(year, month).toLocaleString('default', { month: 'long' })}, {year}
        </h2>
        <button onClick={nextMonth} className="text-xl">&gt;</button>
      </div>

      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-blue-600">Habits</th>
            {days.map(({ weekday }, idx) => (
              <th key={idx} className="border px-1 py-1">{weekday}</th>
            ))}
            <th className="border px-2 py-1 text-blue-600">Goal</th>
            <th className="border px-2 py-1 text-blue-600">Achieved</th>
          </tr>
          <tr>
            <th className="border px-2 py-1"></th>
            {days.map(({ day }) => (
              <th key={day} className="border px-1 py-1">{day}</th>
            ))}
            <th className="border px-2 py-1"></th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, i) => (
            <tr key={i}>
              <td className="border px-2 py-1 text-left">{habit.name}</td>
              {days.map(({ day }) => {
                const key = `${year}-${month + 1}-${day}`;
                const checked = data[key]?.[habit.name] || false;
                return (
                  <td key={day} className="border px-1 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(habit.name, day)}
                    />
                  </td>
                );
              })}
              <td className="border px-2 py-1 text-center">{habit.goal}</td>
              <td className="border px-2 py-1 text-center">{getAchieved(habit.name)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddHabit}
        className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
      >
        + New Habit
      </button>
    </div>
  );
};

export default HabitTracker;
