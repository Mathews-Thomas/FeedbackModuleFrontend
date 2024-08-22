import React, { useState, useEffect } from "react";
import Logo from "../assets/logo-topmost.png"
export const CounterQueue = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [activeTokens, setActiveTokens] = useState({
    1: 1,
    2: 1,
    3: 1,
  });
  const [tokenStatus, setTokenStatus] = useState({
    1: "queue",
    2: "queue",
    3: "queue",
  });

  const data = [
    {
      doctor: "Dr. Fathimalatheef",
      department: "General Dentist",
      counter: "1",
    },
    {
      doctor: "Dr. Pooja Jayan",
      department: "Orthodontist",
      counter: "2",
    },
    {
      doctor: "Dr. Swetha Prasad",
      department: "Pedodontist",
      counter: "3",
    }
  ];

  const clinicName = "TOPMOST Dental - Clinic";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTokenEntry = (counter) => {
    setTokenStatus((prev) => ({
      ...prev,
      [counter]: "in",
    }));
  };

  const handleTokenExit = (counter) => {
    setTokenStatus((prev) => ({
      ...prev,
      [counter]: "out",
    }));
  };

  const handleNextToken = (counter) => {
    setActiveTokens((prev) => ({
      ...prev,
      [counter]: prev[counter] + 1,
    }));
    handleTokenEntry(counter);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header section */}
      <div className="flex justify-center text-purple-800 font-semibold p-5 text-2xl sm:text-4xl">
        <h2 className="flex justify-center items-center"><img src={Logo}  /> - Intelligent Queue Management System</h2>
      </div>

      {/* Table section */}
      <div className="flex justify-center items-center flex-grow">
        <table className="text-center w-full overflow-x-auto">
          <thead className="bg-blue-600 text-white text-xl sm:text-3xl">
            <tr className="border-l-2 border-gray-300">
              <th className="border-l-2 border-gray-300 p-2">Doctor</th>
              <th className="border-l-2 border-gray-300 p-2">Department</th>
              <th className="border-l-2 border-gray-300 p-2">Token</th>
              <th className="border-l-2 border-gray-300 p-2">Counter</th>
              <th className="border-l-2 border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-lg sm:text-2xl">
            {data.map((item) => (
              <tr
                key={item.counter}
                className="border border-gray-300 border-l-2 capitalize"
              >
                <td className="border-l-2 border-gray-300 p-2">
                  {item.doctor}
                </td>
                <td className="border-l-2 border-gray-300 p-2">
                  {item.department}
                </td>
                <td
                  className={`border-l-2 border-gray-300 p-2 ${
                    tokenStatus[item.counter] === "in"
                      ? "bg-green-500 animate-pulse"
                      : ""
                  }`}
                >
                  TM-{activeTokens[item.counter]}
                </td>
                <td className="border-l-2 border-gray-300 p-2 flex flex-col sm:flex-row justify-center items-center">
                  {item.counter}
                  <button
                    onClick={() => handleNextToken(item.counter)}
                    className="mt-2 sm:mt-0 sm:ml-4 bg-blue-600 text-white text-sm p-1 rounded"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handleTokenExit(item.counter)}
                    className="mt-2 sm:mt-0 sm:ml-4 bg-red-600 text-white text-sm p-1 rounded"
                  >
                    Mark Out
                  </button>
                </td>
                <td className="border-l-2 border-gray-300 p-2">
                  {tokenStatus[item.counter] === "in"
                    ? "In"
                    : tokenStatus[item.counter] === "out"
                    ? "Out"
                    : "On Queue"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer section */}
      <div className="bg-purple-800 text-white p-4 text-center  fixed bottom-0 w-full">
        <span className="text-2xl sm:text-4xl bg-green-500 p-3 text-red-700 font-bold">
          {time}
        </span>
        <span className="ml-5 text-2xl sm:text-4xl">{clinicName}</span>
      </div>
    </div>
  );
};
