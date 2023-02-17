import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import ReactModal from "react-modal";
import { Table } from "react-table";
import AppointmentForm from "../templates/AppointmentForm";

const API_URL = "http://localhost:8081/appointments/";

function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
          <button onClick={() => handleToggleStatus(row.original)}>
            {row.original.status === "Pending"
              ? "Mark Completed"
              : "Mark Pending"}
          </button>
          <button
            onClick={() => {
              setSelectedAppointment(row.original);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setShowAddModal(true)}>Add Appointment</button>
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
      >
        <p>Are you sure you want to delete this appointment?</p>
        <button onClick={() => handleDeleteAppointment()}>Yes</button>
        <button onClick={() => setShowDeleteModal(false)}>No</button>
      </ReactModal>
    </div>
  );
}

export default Dashboard;
