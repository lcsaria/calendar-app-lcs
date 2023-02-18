import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import { AuthContext } from "../login/AuthContext";
import { Table } from "../templates/Table";
import AppointmentForm from "../templates/AppointmentForm";

const API_URL = "http://localhost:8081/appointments/";

function Dashboard() {
  // STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");

  // FUNCTIONS
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery(
    ["appointments", searchTerm, statusFilter, sortBy],
    () => {
      const params = {};
      if (searchTerm) {
        params.q = searchTerm;
      }
      if (statusFilter) {
        params.status = statusFilter;
      }
      if (sortBy) {
        params.sort = sortBy;
      }
  
      return axios
        .get(API_URL, { params })
        .then((res) => res.data);
    }
  );

  const addAppointmentMutation = useMutation((appointment) => {
    setShowAddModal(false);
    axios.post(API_URL, appointment).then((res) => {
      console.log(res.data);
      alert("Successfully added!");
      queryClient.invalidateQueries("appointments");
    });
  });

  const deleteAppointmentMutation = useMutation((id) => {
    setShowDeleteModal(false);
    axios.delete(API_URL + id).then((res) => {
      console.log(res.data);
      alert("Successfully deleted!");
      queryClient.invalidateQueries("appointments");
    });
  });

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
    setShowAddModal(false);
    addAppointmentMutation.mutate(appointment);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = () => {
    setShowDeleteModal(false);
    deleteAppointmentMutation.mutate(selectedAppointment.id);
    setSelectedAppointment(null);
  };

  const handleToggleStatus = (appointment) => {
    const newStatus =
      appointment.status === "Pending" ? "Completed" : "Pending";
    updateAppointmentStatusMutation.mutate({
      id: appointment.id,
      status: newStatus,
    });
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
            className="flex justify-center w-full bg-blue-500 text-white px-5 py-2 rounded-md mr-4"
          >
            {row.original.status === "Pending"
              ? "Mark as Completed"
              : "Mark as Pending"}
          </button>
          <button
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowDeleteModal(true);
            }}
            className=" flex justify-center w-full bg-red-500 text-white px-5 py-2 rounded-md"
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  
  const handleLogOut = () => {
    alert("Thank you")
    authContext.setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center p-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search.."
            value={searchTerm}
            onChange={handleSearch}
            className="relative w-full border border-gray-300 rounded-md py-2 px-4"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="relative w-full border border-gray-300 rounded-md py-2 px-4"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="relative w-full flex justify-center bg-blue-500 text-white px-3 py-2 rounded-md"
        >
          Add Appointment
        </button>
        <button
          onClick={handleLogOut}
          className="relative w-full flex justify-center bg-gray-500 text-white px-5 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={appointments} onSort={handleSortBy} />
      )}
      <ReactModal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        contentLabel="Add Appointment Modal"
        className="bg-white rounded-lg shadow-lg p-4 w-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-gray-800 opacity-100"
      >
        <AppointmentForm
          onSave={handleAddAppointment}
          onClose={() => setShowAddModal(false)}
        />
      </ReactModal>

      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        contentLabel="Delete Appointment Modal"
        className="bg-white rounded-lg shadow-lg p-4 w-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-gray-800 opacity-100"
      >
        <div className="p-4">
          <p className="text-xl font-bold">
            Are you sure you want to delete this appointment?
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-blue-500 text-white px-5 py-2 rounded-md mr-4"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAppointment}
              className="bg-red-500 text-white px-5 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default Dashboard;
