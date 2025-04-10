'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function MenuEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [currentMenu, setCurrentMenu] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        
        // Calculate current week number (1-52)
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil(days / 7);
        
        const response = await axios.get(`/api/menu?day=${selectedDay}&weekNumber=${weekNumber}`);
        
        if (response.data.length > 0) {
          setCurrentMenu(response.data[0]);
          
          // Set form values
          mealTypes.forEach(mealType => {
            if (response.data[0].meals[mealType]) {
              response.data[0].meals[mealType].forEach((item, index) => {
                setValue(`${mealType}[${index}].name`, item.name);
                setValue(`${mealType}[${index}].description`, item.description);
              });
            }
          });
        } else {
          setCurrentMenu(null);
          reset();
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, [selectedDay, reset, setValue]);
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Calculate current week number (1-52)
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(days / 7);
      
      // Format data for API
      const formattedData = {
        day: selectedDay,
        weekNumber: weekNumber,
        meals: {}
      };
      
      mealTypes.forEach(mealType => {
        formattedData.meals[mealType] = [];
        
        if (data[mealType]) {
          data[mealType].forEach(item => {
            if (item.name.trim()) {
              formattedData.meals[mealType].push({
                name: item.name.trim(),
                description: item.description?.trim() || ''
              });
            }
          });
        }
      });
      
      await axios.post('/api/menu', formattedData);
      
      toast.success('Menu updated successfully');
      setIsSubmitting(false);
    } catch (error) {
      toast.error('Failed to update menu');
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <div className="text-center p-4">Loading menu...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Food Menu</h2>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
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
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {mealTypes.map((mealType) => (
          <div key={mealType} className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-3 capitalize">{mealType}</h3>
            
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <input
                      type="text"
                      {...register(`${mealType}[${index}].name`)}
                      placeholder="Item name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      {...register(`${mealType}[${index}].description`)}
                      placeholder="Description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Menu'}
          </button>
        </div>
      </form>
    </div>
  );
}
