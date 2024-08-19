import React, { useState } from "react";
import axios from "axios";

export const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    patientNumber: '',
    doctorName: '',
    employeeName: '',
    comment: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/feedback', formData);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Feedback</h1>
        <p className="text-sm text-gray-500 mt-2">
          We are happy to get your feedback
        </p>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-medium">Patient No:</label>
          <input
            type="text"
            name="patientNumber"
            value={formData.patientNumber}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter patient number"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-medium">Dr Name:</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter doctor's name"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-medium">Employee:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter employee name"
          />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="mb-2 text-gray-700 font-medium">Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none h-24"
            placeholder="Enter your comments"
          />
        </div>
        <div className="flex sm:col-span-2 justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
