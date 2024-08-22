import React, { useState, useEffect } from "react";
import Logo from "../assets/logo-topmost.png";

const doctorsData = [
  { doctor: "Dr. Fathimalatheef", department: "General Dentist", counter: 1 },
  { doctor: "Dr. Pooja Jayan", department: "Orthodontist", counter: 2 },
  { doctor: "Dr. Swetha Prasad", department: "Pedodontist", counter: 3 },
  { doctor: "Dr. Shreya Sharma", department: "General Dentist", counter: 4 },
  { doctor: "Dr. Pranav Kumar", department: "Orthodontist", counter: 5 }
];

const clinicName = "TOPMOST Dental - Clinic";

export const CounterQueue = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [activeTokens, setActiveTokens] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [tokenStatus, setTokenStatus] = useState({
    1: "queue",
    2: "queue",
    3: "queue",
    4: "queue",
    5: "queue",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const speakToken = (counter, tokenNumber) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = `Token number ${tokenNumber} please proceed to counter ${counter}`;
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  const handleNextToken = (counter) => {
    const nextToken = activeTokens[counter] + 1;
    setActiveTokens((prev) => ({
      ...prev,
      [counter]: nextToken,
    }));
    setTokenStatus((prev) => ({
      ...prev,
      [counter]: "in",
    }));
    speakToken(counter, nextToken);
  };

  const handleTokenExit = (counter) => {
    setTokenStatus((prev) => ({
      ...prev,
      [counter]: "out",
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-800 text-white py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={Logo} alt="Logo" className="w-36 shadow-lg bg-white" />
          </div>
          <div className="text-lg sm:text-2xl">{time}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-blue-600 text-white items-start">
              <tr>
                <th className="py-4 px-6 text-lg sm:text-xl">Doctor</th>
                <th className="py-4 px-6 text-lg sm:text-xl">Department</th>
                <th className="py-4 px-6 text-lg sm:text-xl">Token</th>
                <th className="py-4 px-6 text-lg sm:text-xl">Counter</th>
                <th className="py-4 px-6 text-lg sm:text-xl">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {doctorsData.map(({ doctor, department, counter }) => (
                <tr key={counter} className="border-t border-gray-200">
                  <td className="py-4 px-6 text-lg sm:text-xl">{doctor}</td>
                  <td className="py-4 px-6 text-lg sm:text-xl">{department}</td>
                  <td
                    className={`py-4 px-6 text-lg sm:text-xl ${
                      tokenStatus[counter] === "in" ? "bg-green-200 text-green-700 animate-pulse" : ""
                    }`}
                  >
                    TM-{activeTokens[counter]}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="text-lg sm:text-xl">{counter}</span>
                      <button
                        onClick={() => handleNextToken(counter)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => handleTokenExit(counter)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm"
                      >
                        Mark Out
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-lg sm:text-xl">
                    {tokenStatus[counter] === "in"
                      ? "In"
                      : tokenStatus[counter] === "out"
                      ? "Out"
                      : "On Queue"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-4">
        <div className="container mx-auto text-center text-lg sm:text-2xl font-bold">
          {clinicName}
        </div>
      </footer>
    </div>
  );
};
