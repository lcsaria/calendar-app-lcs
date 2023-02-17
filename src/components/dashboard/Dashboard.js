import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ReactModal from "react-modal";

import { AuthContext } from '../login/AuthContext';
import { Table } from "../templates/Table";
import AppointmentForm from "../templates/AppointmentForm";

const API_URL = "http://localhost:8081/appointments/";

function Dashboard() {
  // STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // FUNCTIONS
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery("appointments", () =>
    axios.get(API_URL).then((res) => res.data)
  );

  const addAppointmentMutation = useMutation((appointment) =>
    axios.post(API_URL, appointment).then((res) => res.data)
  );

  const deleteAppointmentMutation = useMutation((id) =>
    axios.delete(API_URL + id).then((res) => res.data)
  );

  const updateAppointmentStatusMutation = useMutation(
    ({ id, status }) =>
      axios.patch(API_URL + id, { status }).then((res) => res.data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("appointments");
      },
    }
  );

  const handleAddAppointment = (appointment) => {
    addAppointmentMutation.mutate(appointment);
    setShowAddModal(false);
  };

  const handleDeleteAppointment = () => {
    deleteAppointmentMutation.mutate(selectedAppointment.id);
    setSelectedAppointment(null);
    setShowDeleteModal(false);
  };

  const handleToggleStatus = (appointment) => {
    const newStatus =
      appointment.status === "Pending" ? "Completed" : "Pending";
    updateAppointmentStatusMutation.mutate({
      id: appointment.id,
      status: newStatus,
    });
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Date", accessor: "date" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <>
          <button
            onClick={() => handleToggleStatus(row.original)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
          >
            {row.original.status === "Pending"
              ? "Mark Completed"
              : "Mark Pending"}
          </button>
          <button
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowDeleteModal(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-4"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleLogOut = () => {
    authContext.setIsAuthenticated(false);
    navigate("/");
  }
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 mb-5"
      >
        Add Appointment
      </button>
      <button
        onClick={handleLogOut}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4 mb-5"
      >
        Logout
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={appointments} />
      )}
      <ReactModal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <AppointmentForm onSubmit={handleAddAppointment} />
      </ReactModal>
      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="bg-white rounded-lg shadow-lg p-4 w-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-gray-800 opacity-75"
      >
        <p className="text-lg font-medium mb-4">
          Are you sure you want to delete this appointment?
        </p>
        <div className="flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleDeleteAppointment()}
          >
            Yes
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>
        </div>
      </ReactModal>
    </div>
  );
}

export default Dashboard;
