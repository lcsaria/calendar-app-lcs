import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function AppointmentForm({closeModal}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const queryClient = useQueryClient();

  const addAppointmentMutation = useMutation((newAppointment) =>
    axios.post('http://localhost:8081/appointments', newAppointment)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAppointment = { name, date, status };

    addAppointmentMutation.mutate(newAppointment, {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        setName('');
        setDate('');
        setStatus('Pending');
        alert("Successfully added")
        closeModal();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-sm">
      <label className="block text-gray-700 font-bold mb-2 text-center" htmlFor="name">
          Add Appointment
      </label>
      <div className="mb-4 max-w-sm">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
      >
        Add Appointment
      </button>
    </form>
  );
}


export default AppointmentForm