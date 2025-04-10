'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function IssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/issues');
        setIssues(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load issues. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Resolved</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };
  
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'electrical':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Electrical</span>;
      case 'plumbing':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Plumbing</span>;
      case 'furniture':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Furniture</span>;
      case 'cleaning':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800">Cleaning</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Other</span>;
    }
  };
  
  if (loading) return <div className="text-center p-4">Loading issues...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">My Reported Issues</h2>
      
      {issues.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          You haven't reported any issues yet.
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <div className="flex space-x-2">
                  {getCategoryBadge(issue.category)}
                  {getStatusBadge(issue.status)}
                </div>
              </div>
              
              <p className="mt-2 text-gray-600">{issue.description}</p>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>Reported on {format(new Date(issue.createdAt), 'MMM dd, yyyy')}</span>
                
                {issue.adminRemarks && (
                  <div className="ml-4">
                    <span className="font-medium">Admin remarks:</span> {issue.adminRemarks}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
