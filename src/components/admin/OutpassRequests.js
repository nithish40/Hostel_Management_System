'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function OutpassRequests() {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/outpass');
        setOutpasses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load outpass requests. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOutpasses();
  }, []);
  
  const updateOutpassStatus = async (id, status, remarks = '') => {
    try {
      await axios.put('/api/outpass', {
        id,
        status,
        adminRemarks: remarks
      });
      
      setOutpasses(outpasses.map(outpass => 
        outpass._id === id ? { ...outpass, status, adminRemarks: remarks } : outpass
      ));
      
      toast.success(`Outpass ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error('Failed to update outpass status');
    }
  };
  
  const handleApprove = (id) => {
    updateOutpassStatus(id, 'approved', 'Approved by admin');
  };
  
  const handleReject = (id) => {
    const remarks = prompt('Please provide a reason for rejection:');
    if (remarks !== null) {
      updateOutpassStatus(id, 'rejected', remarks);
    }
  };
  
  const filteredOutpasses = outpasses.filter(outpass => {
    if (filter === 'all') return true;
    return outpass.status === filter;
  });
  
  if (loading) return <div className="text-center p-4">Loading outpass requests...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Outpass Requests</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${
              filter === 'all' ? 'bg-blue-500 text-black' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${
              filter === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded-md ${
              filter === 'approved' ? 'bg-green-500 text-black' : 'bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 rounded-md ${
              filter === 'rejected' ? 'bg-red-500 text-black' : 'bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>
      
      {filteredOutpasses.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          No outpass requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOutpasses.map((outpass) => (
                <tr key={outpass._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outpass.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outpass.student.hostelBlock}-{outpass.student.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outpass.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outpass.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(outpass.departureDate), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(outpass.returnDate), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      outpass.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : outpass.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                                          {outpass.status.charAt(0).toUpperCase() + outpass.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {outpass.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(outpass._id)}
                          className="px-3 py-1 bg-green-500 text-black rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(outpass._id)}
                          className="px-3 py-1 bg-red-500 text-black rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>{outpass.adminRemarks || '-'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
