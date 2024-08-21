import React, { useState, useEffect, useCallback } from "react";
import Axios from "../../Config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export const FeedbackSection = () => {
  const initialFormData = {
    patientMobile: "",
    doctorName: "",
    employeeName: "",
    doctorRating: 0,
    employeeRating: 0,
    comment: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [patientDetails, setPatientDetails] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [noPatientFound, setNoPatientFound] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleRatingChange = (name, rating) => {
    setFormData((prevData) => ({ ...prevData, [name]: rating }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientMobile || formData.patientMobile.length !== 10) {
      newErrors.patientMobile = "Valid mobile number or Patient ID is required.";
    }
    if (!selectedPatient) {
      newErrors.selectedPatient = "Please select a patient.";
    }
    if (!formData.doctorName) {
      newErrors.doctorName = "Doctor's name is required.";
    }
    if (formData.doctorRating === 0) {
      newErrors.doctorRating = "Please rate the doctor.";
    }
    if (!formData.employeeName) {
      newErrors.employeeName = "Employee's name is required.";
    }
    if (formData.employeeRating === 0) {
      newErrors.employeeRating = "Please rate the employee.";
    }
    if (formData.comment.length < 10) {
      newErrors.comment = "Comment must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await Axios.post("/feedback", formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "🎉 Feedback Submitted!",
        html: "<b>Thank you for your Feedback!</b><br>Your feedback helps us improve.",
        showConfirmButton: false,
        timer: 2000,
        background: "#f0f8ff",
        iconColor: "#28a745",
        customClass: {
          popup: "animate__animated animate__fadeInDown",
          title: "text-success",
          htmlContainer: "text-info",
        },
      });

      resetForm();
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "❌ Feedback Submission Failed!",
        html: "<b>Something went wrong.</b><br>Please try again later.",
        showConfirmButton: false,
        timer: 2000,
        background: "#ffe6e6",
        iconColor: "#dc3545",
        customClass: {
          popup: "animate__animated animate__shakeX",
          title: "text-danger",
          htmlContainer: "text-dark",
        },
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setDoctors([]);
    setEmployees([]);
    setPatientDetails([]);
    setSelectedPatient(null);
  };

  const fetchPatientDetails = useCallback(
    async (searchValue) => {
      if (!searchValue) {
        resetForm();
        setNoPatientFound(false);
        return;
      }
      try {
        const { data } = await Axios.get(
          `/get-patient-details?phone=${searchValue}`
        );
        if (data.patients.length === 0) {
          setNoPatientFound(true);
          resetForm();
        } else {
          const filteredDoctors = data.doctors.filter(
            (doctor) => doctor.BranchID === data.patients[0].BranchID
          );
          setPatientDetails(data.patients);
          setDoctors(filteredDoctors);
          fetchEmployeeData();
          setNoPatientFound(false);
          if (data.patients.length === 1) {
            handlePatientSelection(data.patients[0], filteredDoctors);
          }
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setNoPatientFound(true);
        resetForm();
      }
    },
    []
  );

  const handlePatientSelection = (patient, doctorList = doctors) => {
    setSelectedPatient(patient);
    setPatientDetails([]); // Clear other search results after selection
    setFormData((prevData) => ({
      ...prevData,
      patientMobile: patient.phone,
      patientName: patient.Name,
      PatientID: patient.PatientID,
      patientId: patient._id,
      doctorId: doctorList[0]?._id || "",
      doctorName: doctorList[0]?.name || "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, selectedPatient: "" }));
  };
  

  const fetchEmployeeData = useCallback(async () => {
    try {
      const { data } = await Axios.get("/get-employee-details");
      const userEmployees = data.filter(
        (employee) => employee.role?.roleType === "user"
      );
      setEmployees(userEmployees);
      if (userEmployees.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          employeeId: userEmployees[0]._id,
          employeeName: `${userEmployees[0].firstName} ${userEmployees[0].lastName}`,
        }));
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }, []);

  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchPatientDetails = useCallback(
    debounce(fetchPatientDetails, 500),
    [fetchPatientDetails,]
  );

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
          <label className="mb-2 text-lg text-gray-800 font-semibold">
            Patient Mobile Number or Patient ID:
          </label>
          <input
            type="text"
            name="patientMobile"
            value={formData.patientMobile || ""}
            onChange={(e) => {
              handleChange(e);
              debouncedFetchPatientDetails(e.target.value);
            }}
            className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter patient's mobile number or Patient ID"
          />
          {patientDetails.map((patient, index) => (
            <div
              key={index}
              className="mt-2 bg-gray-100 p-2 cursor-pointer hover:bg-gray-200 capitalize rounded-md"
              onClick={() => handlePatientSelection(patient)}
            >
              {patient.Name}, Age: {patient.age}, City: {patient.address?.city}, PatientID: {patient.PatientID}
            </div>
          ))}
          {errors.patientMobile && (
            <p className="text-red-500 mt-2">{errors.patientMobile}</p>
          )}
          {noPatientFound && (
            <p className="text-red-500 mt-2">
              No patient found with this phone number or Patient ID.
            </p>
          )}
        </div>

        {selectedPatient && (
          <div className="mt-6 space-y-4">
            <InputField
              label="Name"
              value={selectedPatient.Name}
              disabled
            />
            <InputField
              label="Age"
              value={selectedPatient.age}
              disabled
            />
            <InputField
              label="City"
              value={selectedPatient.address?.city}
              disabled
            />
            <InputField
              label="Patient ID"
              value={selectedPatient.PatientID}
              disabled
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          <DropdownField
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
            options={doctors}
            onChange={handleChange}
            error={errors.doctorName}
          />
          <RatingField
            label="Doctor Rating"
            name="doctorRating"
            rating={formData.doctorRating}
            onRatingChange={handleRatingChange}
            error={errors.doctorRating}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <DropdownField
            label="Employee Name"
            name="employeeName"
            value={formData.employeeName}
            options={employees}
            onChange={handleChange}
            error={errors.employeeName}
          />
          <RatingField
            label="Employee Rating"
            name="employeeRating"
            rating={formData.employeeRating}
            onRatingChange={handleRatingChange}
            error={errors.employeeRating}
          />
        </div>

        <TextareaField
          label="Comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          error={errors.comment}
        />

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-colors duration-300 shadow-md"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, value, disabled }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-lg text-gray-800 font-semibold">{label}:</label>
    <input
      type="text"
      value={value}
      className="border capitalize cursor-not-allowed border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none text-gray-800"
      disabled={disabled}
    />
  </div>
);

const DropdownField = ({ label, name, value, options, onChange, error }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-lg text-gray-800 font-semibold">{label}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800"
    >
      <option value="" disabled>
        Select {label.toLowerCase()}
      </option>
      {options.map((option) => (
        <option key={option._id} value={option.name || `${option.firstName} ${option.lastName}`}>
          {option.name || `${option.firstName} ${option.lastName}`}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

const RatingField = ({ label, name, rating, onRatingChange, error }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-lg text-gray-800 font-semibold">{label}:</label>
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`cursor-pointer transition-colors duration-200 ${star <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-500`}
          onClick={() => onRatingChange(name, star)}
        />
      ))}
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, value, onChange, error }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-lg text-gray-800 font-semibold">{label}:</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none text-gray-800 h-32"
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);
