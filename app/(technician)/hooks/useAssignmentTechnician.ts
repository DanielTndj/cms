import { useState, useEffect } from "react";
import {
  Assignment,
  AssignmentFormData,
} from "@technician/types/index";
import { DEFAULT_FORM_DATA } from "@technician/constants/forms";
import { getNextAssignmentId } from "@technician/utils/technicianHelper";
import { formatLocalDate } from "@lib/utils/date";

export const useAssignmentTechnician = (initialAssignments: Assignment[]) => {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">(
    "view"
  );
  const [formData, setFormData] =
    useState<AssignmentFormData>(DEFAULT_FORM_DATA);

  useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

  // Create new assignment
  const handleCreate = (selectedDate: Date) => {
    console.log("selectedDate: ", selectedDate);
    setModalMode("create");
    setSelectedAssignment(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      date: formatLocalDate(selectedDate), // ✅ FIXED
    });
    setShowModal(true);
  };

  // Edit existing assignment
  const handleEdit = (assignment: Assignment) => {
    setModalMode("edit");
    setSelectedAssignment(assignment);
    setFormData({
      technicianIds: assignment.technicianIds,
      locationId: assignment.locationId.toString(),
      title: assignment.title,
      description: assignment.description,
      date: formatLocalDate(assignment.date), // ✅ FIXED
      priority: assignment.priority,
      notes: assignment.notes || "",
    });
    setShowModal(true);
  };

  // View assignment details
  const handleView = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setModalMode("view");
    setShowModal(true);
  };

  // Delete assignment
  const handleDelete = (assignmentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus assignment ini?")) {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setShowModal(false);
    }
  };

  // Save assignment (create or update)
  const handleSave = () => {
    if (
      formData.technicianIds.length === 0 ||
      !formData.locationId ||
      !formData.title
    ) {
      alert("Mohon lengkapi data yang diperlukan");
      return;
    }

    const assignmentData = {
      technicianIds: formData.technicianIds,
      locationId: parseInt(formData.locationId),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      priority: formData.priority,
      notes: formData.notes,
      status:
        modalMode === "create"
          ? ("scheduled" as const)
          : selectedAssignment?.status || ("scheduled" as const),
    };

    if (modalMode === "create") {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: getNextAssignmentId(assignments),
      };
      setAssignments((prev) => [...prev, newAssignment]);
    } else if (selectedAssignment) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id ? { ...a, ...assignmentData } : a
        )
      );
    }

    setShowModal(false);
    setSelectedAssignment(null);
  };

  // Update assignment status
  const handleStatusChange = (
    assignmentId: number,
    newStatus: Assignment["status"]
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: newStatus } : a))
    );
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
  };

  return {
    assignments,
    selectedAssignment,
    showModal,
    modalMode,
    formData,
    setFormData,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleSave,
    handleStatusChange,
    handleCloseModal,
  };
};
