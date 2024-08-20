import React, { useState, useEffect } from "react";
import Axios from "../../Config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    patientMobile: "",
    doctorName: "",
    employeeName: "",
    doctorRating: 0,
    employeeRating: 0,
    comment: ""
  });

  const [patientDetails, setPatientDetails] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for selected patient
  const [doctors, setDoctors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null); // State for error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (name, rating) => {
    setFormData({ ...formData, [name]: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/feedback", formData);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const fetchPatientDetails = async (phone) => {
    try {
      const response = await Axios.get(`/get-patient-details?phone=${phone}`);
      if (response.data.patients.length === 0) {
        setError("Patient not found");
        setPatientDetails([]);
        setSelectedPatient(null);
      } else {
        setError(null); // Clear the error if patients are found
        setPatientDetails(response.data.patients);
        setDoctors(response.data.doctors);

        if (response.data.patients.length === 1) {
          setSelectedPatient(response.data.patients[0]);
          updateFormData(response.data.patients[0], response.data.doctors);
        }
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("An error occurred while fetching patient details.");
      setPatientDetails([]); // Reset if there's an error
      setSelectedPatient(null);
    }
  };

  const updateFormData = (patient, doctors) => {
    setFormData((prevData) => ({
      ...prevData,
      patientMobile: patient.phone,
      patientName: patient.Name,
      PatientID: patient.PatientID,
      patientId: patient._id,
      doctorId: doctors[0]?._id || "",
      doctorName: doctors[0]?.name || ""
    }));
  };

  const handlePatientSelection = (patient) => {
    setSelectedPatient(patient);
    updateFormData(patient, doctors);
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await Axios.get("/get-employee-details");
      const filterEmployees = await response?.data?.filter((employee) => employee?.role?.roleType === "user");
      setEmployees(filterEmployees);
      setFormData((prevData) => ({
        ...prevData,
        employeeId: filterEmployees[0]._id,
        employeeName: filterEmployees[0].name
      }));
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-12 border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Patient Feedback</h1>
        <p className="text-md text-gray-600 mt-2">
          Your feedback helps us improve our services.
        </p>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="mb-2 text-lg text-gray-800 font-semibold">Patient Mobile Number:</label>
          <input
            type="text"
            name="patientMobile"
            value={formData.patientMobile || ""}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value.length === 10) { // Assuming mobile numbers are 10 digits
                fetchPatientDetails(e.target.value);
              }
            }}
            className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter patient's mobile number"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {patientDetails.length > 1 && (
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-800 font-semibold">Select Patient:</label>
            <select
              onChange={(e) => handlePatientSelection(patientDetails[e.target.value])}
              className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
            >
              <option value="" disabled selected>Select a patient</option>
              {patientDetails.map((patient, index) => (
                <option key={index} value={index}>
                  {patient.Name}, Age: {patient.age}, City: {patient.address.city}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedPatient && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col">
              <label className="mb-2 text-lg text-gray-800 font-semibold" htmlFor="patientName">
                Name:
              </label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={selectedPatient.Name}
                className="border cursor-not-allowed border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none text-gray-800"
                disabled
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-lg text-gray-800 font-semibold" htmlFor="patientAge">
                Age:
              </label>
              <input
                type="text"
                id="patientAge"
                name="patientAge"
                value={selectedPatient.age}
                className="border cursor-not-allowed border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none text-gray-800"
                disabled
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-lg text-gray-800 font-semibold" htmlFor="patientPlace">
                Place:
              </label>
              <input
                type="text"
                id="patientPlace"
                name="patientPlace"
                value={selectedPatient.address.city}
                className="border cursor-not-allowed border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none text-gray-800"
                disabled
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-800 font-semibold">Doctor Name:</label>
            <select
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
            >
              <option value="" disabled>Select doctor's name</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor.name}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-800 font-semibold">Doctor Rating:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`cursor-pointer transition-colors duration-200 ${
                    star <= formData.doctorRating ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-500`}
                  onClick={() => handleRatingChange("doctorRating", star)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-800 font-semibold">Employee Name:</label>
            <select
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
            >
              <option value="" disabled>Select employee's name</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee.firstName + " " + employee.lastName}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-lg text-gray-800 font-semibold">Employee Rating:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`cursor-pointer transition-colors duration-200 ${
                    star <= formData.employeeRating ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-500`}
                  onClick={() => handleRatingChange("employeeRating", star)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-lg text-gray-800 font-semibold">Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800 h-32"
            placeholder="Enter your comments"
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-colors duration-300 shadow-md"
            type="submit"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};
