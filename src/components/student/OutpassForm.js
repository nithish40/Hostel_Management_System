'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function OutpassForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Ensure dates are in the correct format
      const departureDate = new Date(data.departureDate);
      const returnDate = new Date(data.returnDate);
      
      if (returnDate < departureDate) {
        toast.error('Return date cannot be before departure date');
        setIsSubmitting(false);
        return;
      }
      
      await axios.post('/api/outpass', {
        reason: data.reason,
        destination: data.destination,
        departureDate,
        returnDate
      });
      
      toast.success('Outpass request submitted successfully');
      reset();
      router.refresh();
      router.push('/outpass');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit outpass request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Request Outpass</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Outpass
          </label>
          <textarea
            id="reason"
            {...register('reason', { required: 'Reason is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          ></textarea>
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            {...register('destination', { required: 'Destination is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date & Time
            </label>
            <input
              type="datetime-local"
              id="departureDate"
              {...register('departureDate', { required: 'Departure date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
              Return Date & Time
            </label>
            <input
              type="datetime-local"
              id="returnDate"
              {...register('returnDate', { required: 'Return date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">{errors.returnDate.message}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
