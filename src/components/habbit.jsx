// components/HabitTracker.jsx
import React, { useState, useEffect } from 'react';

import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";


const habits = ['Workout', 'Read', 'Code', 'Meditate'];

const getDaysInMonth = (year, month) => {
  return new Array(new Date(year, month + 1, 0).getDate()).fill(null).map((_, idx) => idx + 1);
};

const HabitTracker = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const days = getDaysInMonth(year, month);

  const [habitData, setHabitData] = useState(() => {
    const saved = localStorage.getItem('habitData');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "habitData", "user1");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHabitData(docSnap.data());
      }
    };
    fetchData();
  }, []);
  

  const toggleHabit = (day, habit) => {
    const key = `${year}-${month + 1}-${day}`;
    setHabitData(prev => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = {};
      updated[key][habit] = !updated[key][habit];
      return updated;
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Habit Tracker - {today.toLocaleString('default', { month: 'long' })} {year}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {days.map(day => {
          const dateKey = `${year}-${month + 1}-${day}`;
          const isToday = day === today.getDate();
          return (
            <div
              key={day}
              className={`rounded-xl shadow p-4 transition duration-200 ${
                isToday ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-white border'
              }`}
            >
              <h3 className="text-lg font-semibold mb-2 text-center">Day {day}</h3>
              <div className="space-y-2">
                {habits.map(habit => {
                  const completed = habitData[dateKey]?.[habit] || false;
                  return (
                    <div
                      key={habit}
                      className="flex items-center justify-between px-3 py-1 bg-gray-100 rounded"
                    >
                      <span className="text-sm">{habit}</span>
                      <button
                        onClick={() => toggleHabit(day, habit)}
                        className={`w-5 h-5 rounded-full border ${
                          completed ? 'bg-green-500 border-green-600' : 'bg-gray-300'
                        }`}
                      ></button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
