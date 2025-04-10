'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MenuView() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const currentDay = days[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1];
        setSelectedDay(currentDay);
        
        // Calculate week number (1-52)
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const daysPassed = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil(daysPassed / 7);
        
        const response = await axios.get(`/api/menu?day=${currentDay}&weekNumber=${weekNumber}`);
        setMenu(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(`Failed to load menu. Please try again later. ${err}`);
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);
  
  const handleDayChange = async (day) => {
    try {
      setSelectedDay(day);
      setLoading(true);
      
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const daysPassed = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(daysPassed / 7);
      
      const response = await axios.get(`/api/menu?day=${day}&weekNumber=${weekNumber}`);
      setMenu(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError('Failed to load menu. Please try again later.');
      setLoading(false);
    }
  };
  
  if (loading) return <div className="text-center p-4">Loading menu...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Food Menu</h2>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleDayChange(day)}
            className={`px-4 py-2 rounded-md capitalize ${
              selectedDay === day
                ? 'bg-blue-500 text-black'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      
      {menu.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          No menu available for this day. Please check back later.
        </div>
      ) : (
        menu.map((menuItem) => (
          <div key={menuItem._id} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(menuItem.meals).map(([mealType, items]) => (
                <div key={mealType} className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-3 capitalize">{mealType}</h3>
                  {!items || items.length === 0 ? (
                    <p className="text-gray-500">No items available</p>
                  ) : (
                    <ul className="space-y-2">
                      {Array.isArray(items) ? items.map((item, index) => (
                        <li key={index} className="border-b border-gray-200 pb-2">
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </li>
                      )) : (
                        <p className="text-gray-500">Invalid menu data format</p>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
