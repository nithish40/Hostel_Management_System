'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function AdminIssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
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
  
  const updateIssueStatus = async (id, status, remarks = '') => {
    try {
      await axios.put('/api/issues', {
        id,
        status,
        adminRemarks: remarks
      });
      
      setIssues(issues.map(issue => 
        issue._id === id ? { ...issue, status, adminRemarks: remarks } : issue
      ));
      
      toast.success(`Issue status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update issue status');
    }
  };
  
  const handleInProgress = (id) => {
    updateIssueStatus(id, 'in-progress', 'Issue is being addressed');
  };
  
  const handleResolve = (id) => {
    const remarks = prompt('Please provide resolution details:');
    if (remarks !== null) {
      updateIssueStatus(id, 'resolved', remarks);
    }
  };
  
  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });
  
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
    <div className=" text-black bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reported Issues</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md ${
              filter === "all" ? "bg-blue-500 text-black" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-md ${
              filter === "pending" ? "bg-yellow-500 text-black" : "bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-3 py-1 rounded-md ${
              filter === "in-progress"
                ? "bg-blue-500 text-black"
                : "bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1 rounded-md ${
              filter === "resolved" ? "bg-green-500 text-black" : "bg-gray-200"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          No issues found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{issue.title}</h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {issue.student.name} • Room {issue.student.hostelBlock}-
                      {issue.student.roomNumber}
                    </span>
                    {getCategoryBadge(issue.category)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      issue.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : issue.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {issue.status === "in-progress"
                      ? "In Progress"
                      : issue.status.charAt(0).toUpperCase() +
                        issue.status.slice(1)}
                  </span>

                  {issue.status !== "resolved" && (
                    <div className="flex space-x-2">
                      {issue.status === "pending" && (
                        <button
                          onClick={() => handleInProgress(issue._id)}
                          className="px-3 py-1 bg-blue-500 text-black rounded-md hover:bg-blue-600 text-xs"
                        >
                          Mark In Progress
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(issue._id)}
                        className="px-3 py-1 bg-green-500 text-black rounded-md hover:bg-green-600 text-xs"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-3 text-gray-600">{issue.description}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>
                  Reported on{" "}
                  {format(new Date(issue.createdAt), "MMM dd, yyyy")}
                </span>

                {issue.adminRemarks && (
                  <div className="ml-4">
                    <span className="font-medium">Admin remarks:</span>{" "}
                    {issue.adminRemarks}
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
