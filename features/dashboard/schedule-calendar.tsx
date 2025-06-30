"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  Calendar,
  Grid3X3,
  List,
  Wrench,
  Building,
  Phone,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Select from "react-select";

interface Technician {
  id: number;
  name: string;
  phone: string;
  skill: string;
  status: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  type: string;
}

interface Assignment {
  id: number;
  technicianIds: number[];
  locationId: number;
  title: string;
  description: string;
  date: Date;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
}

// Sample technicians data
const technicians: Technician[] = [
  {
    id: 1,
    name: "Ahmad Rahman",
    phone: "081234567890",
    skill: "Service Pompa",
    status: "active",
  },
  {
    id: 2,
    name: "Budi Santoso",
    phone: "081234567891",
    skill: "Pasang Pompa",
    status: "active",
  },
  {
    id: 3,
    name: "Citra Dewi",
    phone: "081234567892",
    skill: "Perbaikan Listrik",
    status: "active",
  },
];

// Sample locations data
const locations: Location[] = [
  {
    id: 1,
    name: "Mall Taman Anggrek",
    address: "Jl. S. Parman, Jakarta Barat",
    type: "Mall",
  },
  {
    id: 2,
    name: "Hotel Grand Hyatt",
    address: "Jl. MH Thamrin, Jakarta Pusat",
    type: "Hotel",
  },
  {
    id: 3,
    name: "Office Tower Kuningan",
    address: "Jl. HR Rasuna Said, Jakarta Selatan",
    type: "Office",
  },
];

// Sample assignments data
const sampleAssignments: Assignment[] = [
  {
    id: 1,
    technicianIds: [1, 2],
    locationId: 1,
    title: "Pasang Pompa",
    description: "Pasang pompa air baru",
    date: new Date(2025, 5, 30),
    status: "scheduled",
    priority: "medium",
    notes: "Pompa air merk Grundfos",
  },
  {
    id: 2,
    technicianIds: [1],
    locationId: 2,
    title: "Service pompa",
    description: "Service pompa air",
    date: new Date(2025, 5, 30),
    status: "scheduled",
    priority: "high",
    notes: "Pompa sering mati",
  },
];

// Calendar views
const VIEW_TYPES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
} as const;

type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];

const PRIORITY_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
} as const;

const STATUS_COLORS = {
  scheduled: "border-l-blue-500",
  "in-progress": "border-l-orange-500",
  completed: "border-l-green-500",
  cancelled: "border-l-gray-500",
} as const;

export default function TechnicianAssignmentCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>(VIEW_TYPES.MONTH);
  const [assignments, setAssignments] =
    useState<Assignment[]>(sampleAssignments);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">(
    "view"
  );

  // Form state for create/edit
  const [formData, setFormData] = useState({
    technicianIds: [] as number[],
    locationId: "",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    notes: "",
  });

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) => isSameDay(assignment.date, date));
  };

  const getTechnicianById = (id: number) =>
    technicians.find((t) => t.id === id);
  const getLocationById = (id: number) => locations.find((l) => l.id === id);

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === VIEW_TYPES.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === VIEW_TYPES.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === VIEW_TYPES.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === VIEW_TYPES.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // CRUD Functions
  const handleCreate = () => {
    setModalMode("create");
    setSelectedAssignment(null);
    setFormData({
      technicianIds: [],
      locationId: "",
      title: "",
      description: "",
      date: selectedDate.toISOString().split("T")[0],
      priority: "medium",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setModalMode("edit");
    setSelectedAssignment(assignment);
    setFormData({
      technicianIds: assignment.technicianIds,
      locationId: assignment.locationId.toString(),
      title: assignment.title,
      description: assignment.description,
      date: assignment.date.toISOString().split("T")[0],
      priority: assignment.priority,
      notes: assignment.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = (assignmentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus assignment ini?")) {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setShowModal(false);
    }
  };

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
          ? "scheduled"
          : selectedAssignment?.status || "scheduled",
    };

    if (modalMode === "create") {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: Math.max(...assignments.map((a) => a.id), 0) + 1,
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

  const handleStatusChange = (
    assignmentId: number,
    newStatus: Assignment["status"]
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: newStatus } : a))
    );
  };

  const toggleTechnicianSelection = (techId: number) => {
    setFormData((prev) => {
      if (prev.technicianIds.includes(techId)) {
        return {
          ...prev,
          technicianIds: prev.technicianIds.filter((id) => id !== techId),
        };
      } else {
        return {
          ...prev,
          technicianIds: [...prev.technicianIds, techId],
        };
      }
    });
  };

  // Generate calendar grid for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Generate week view
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const calendarDays = useMemo(() => {
    if (view === VIEW_TYPES.MONTH) return generateCalendarDays();
    if (view === VIEW_TYPES.WEEK) return generateWeekDays();
    return [currentDate];
  }, [currentDate, view]);

  const getViewTitle = () => {
    if (view === VIEW_TYPES.MONTH) {
      return currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    } else if (view === VIEW_TYPES.WEEK) {
      const weekDays = generateWeekDays();
      const start = weekDays[0].toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      const end = weekDays[6].toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${start} - ${end}`;
    } else {
      return formatDate(currentDate);
    }
  };

  const technicianOptions = technicians.map((tech) => ({
    value: tech.id,
    label: `${tech.name} - ${tech.skill}`,
  }));
  // Modal Component
  const AssignmentModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
        <Card
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {modalMode === "create"
                  ? "Assign Teknisi Baru"
                  : modalMode === "edit"
                  ? "Edit Assignment"
                  : "Detail Assignment"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {modalMode === "view" && selectedAssignment ? (
              // View Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Teknisi
                    </label>
                    <div className="space-y-2 mt-1">
                      {selectedAssignment.technicianIds.map((techId) => {
                        const tech = getTechnicianById(techId);
                        return tech ? (
                          <div key={techId} className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{tech.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {tech.skill}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lokasi
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4" />
                      <div>
                        <p className="font-medium">
                          {getLocationById(selectedAssignment.locationId)?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            getLocationById(selectedAssignment.locationId)
                              ?.address
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tugas
                  </label>
                  <h3 className="text-lg font-semibold mt-1">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tanggal
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p>{formatDate(selectedAssignment.date)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status & Prioritas
                    </label>
                    <div className="mt-1">
                      <div className="flex gap-2">
                        <select
                          value={selectedAssignment.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedAssignment.id,
                              e.target.value as Assignment["status"]
                            )
                          }
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="scheduled">Terjadwal</option>
                          <option value="in-progress">
                            Sedang Berlangsung
                          </option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                        <span
                          className={`px-2 py-1 text-xs rounded text-white ${
                            PRIORITY_COLORS[selectedAssignment.priority]
                          }`}
                        >
                          {selectedAssignment.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAssignment.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Catatan
                    </label>
                    <p className="mt-1 p-2 bg-muted rounded">
                      {selectedAssignment.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedAssignment.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Tutup
                    </Button>
                    <Button onClick={() => handleEdit(selectedAssignment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Create/Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Lokasi *</label>
                  <Select
                    isMulti
                    options={technicianOptions}
                    value={technicianOptions.filter((opt) =>
                      formData.technicianIds.includes(opt.value)
                    )}
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        technicianIds: selected.map((opt) => opt.value),
                      }));
                    }}
                    className="mt-1"
                    classNames={{
                      control: () => "!bg-card !border-border",
                      menu: () => "!bg-background !border-border",
                      option: () =>
                        "!bg-background !text-foreground hover:!bg-primary-foreground",
                      multiValue: () => "!bg-primary/10",
                      multiValueLabel: () => "!text-primary",
                      input: () => "!text-foreground",
                    }}
                    placeholder="Pilih teknisi..."
                    noOptionsMessage={() => "Tidak ada teknisi tersedia"}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Lokasi *</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        locationId: e.target.value,
                      }))
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                    required
                  >
                    <option value="">Pilih Lokasi</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Judul Tugas *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                    placeholder="Contoh: Service pompa"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                    rows={3}
                    placeholder="Deskripsi detail tugas..."
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tanggal</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border border-border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value as Assignment["priority"],
                      }))
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Mendesak</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Catatan</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                    rows={2}
                    placeholder="Catatan tambahan..."
                    autoComplete="off"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {modalMode === "create"
                      ? "Buat Assignment"
                      : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-border">
      {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
        <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => {
        const dayAssignments = getAssignmentsForDate(day);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);

        return (
          <div
            key={index}
            className={`bg-background p-2 min-h-32 cursor-pointer hover:bg-muted/50 transition-colors ${
              !isCurrentMonth ? "text-muted-foreground" : ""
            }`}
            onClick={() => setSelectedDate(day)}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`text-sm font-medium ${
                  isToday
                    ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    : isSelected
                    ? "bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center"
                    : ""
                }`}
              >
                {day.getDate()}
              </div>
              {isSelected && (
                <Button
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreate();
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {dayAssignments.slice(0, 3).map((assignment) => {
                const techniciansList = assignment.technicianIds
                  .map((id) => getTechnicianById(id)?.name)
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div
                    key={assignment.id}
                    className={`${
                      PRIORITY_COLORS[assignment.priority]
                    } text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                      STATUS_COLORS[assignment.status]
                    } border-l-4`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignment(assignment);
                      setModalMode("view");
                      setShowModal(true);
                    }}
                  >
                    <div className="font-medium truncate">
                      {assignment.title}
                    </div>
                    <div className="truncate opacity-90">{techniciansList}</div>
                  </div>
                );
              })}
              {dayAssignments.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{dayAssignments.length - 3} lainnya
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 gap-px bg-border mb-px">
        {calendarDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={index} className="bg-muted p-2 text-center">
              <div className="text-xs text-muted-foreground">
                {day.toLocaleDateString("id-ID", { weekday: "short" })}
              </div>
              <div
                className={`text-sm font-medium ${
                  isToday
                    ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                    : ""
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border flex-1">
        {calendarDays.map((day, index) => {
          const dayAssignments = getAssignmentsForDate(day);
          return (
            <div key={index} className="bg-background p-2 min-h-96">
              <div className="space-y-1">
                {dayAssignments.map((assignment) => {
                  const techniciansList = assignment.technicianIds
                    .map((id) => getTechnicianById(id)?.name)
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={assignment.id}
                      className={`${
                        PRIORITY_COLORS[assignment.priority]
                      } text-white text-xs p-2 rounded cursor-pointer hover:opacity-80 ${
                        STATUS_COLORS[assignment.status]
                      } border-l-4`}
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                    >
                      <div className="font-medium">{assignment.title}</div>
                      <div className="truncate">{techniciansList}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => {
    const dayAssignments = getAssignmentsForDate(currentDate);

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
            <p className="text-sm text-muted-foreground">
              {currentDate.toLocaleDateString("id-ID", { weekday: "long" })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {dayAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada assignment hari ini</p>
            </div>
          ) : (
            dayAssignments.map((assignment) => {
              const location = getLocationById(assignment.locationId);
              return (
                <Card
                  key={assignment.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    STATUS_COLORS[assignment.status]
                  } border-l-4`}
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setModalMode("view");
                    setShowModal(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          PRIORITY_COLORS[assignment.priority]
                        } mt-1 flex-shrink-0`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {assignment.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded text-white ${
                              PRIORITY_COLORS[assignment.priority]
                            }`}
                          >
                            {assignment.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="space-y-1">
                            {assignment.technicianIds.map((techId) => {
                              const tech = getTechnicianById(techId);
                              return tech ? (
                                <div
                                  key={techId}
                                  className="flex items-center gap-1"
                                >
                                  <User className="h-4 w-4" />
                                  <span>{tech.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{location?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{location?.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto space-y-4 p-4">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-5 w-5 md:h-6 md:w-6" />
            Technician Assignment
          </h1>
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Hari Ini
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-32 text-center">
              <h2 className="text-sm md:text-base font-semibold">
                {getViewTitle()}
              </h2>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            className="sm:hidden"
          >
            Hari Ini
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex border border-border rounded-md">
            <Button
              variant={view === VIEW_TYPES.DAY ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(VIEW_TYPES.DAY)}
              className="rounded-r-none px-2 text-xs sm:text-sm"
            >
              Hari
            </Button>
            <Button
              variant={view === VIEW_TYPES.WEEK ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(VIEW_TYPES.WEEK)}
              className="rounded-none border-x-0 px-2 text-xs sm:text-sm"
            >
              Minggu
            </Button>
            <Button
              variant={view === VIEW_TYPES.MONTH ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(VIEW_TYPES.MONTH)}
              className="rounded-l-none px-2 text-xs sm:text-sm"
            >
              Bulan
            </Button>
          </div>

          <Button
            onClick={handleCreate}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Assign Teknisi
          </Button>
        </div>
      </div>

      {/* Stats Cards - Responsive */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        <Card className="h-full">
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs sm:text-sm font-medium">Terjadwal</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {assignments.filter((a) => a.status === "scheduled").length}
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs sm:text-sm font-medium">
                Berlangsung
              </span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {assignments.filter((a) => a.status === "in-progress").length}
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span className="text-xs sm:text-sm font-medium">Selesai</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {assignments.filter((a) => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <span className="text-xs sm:text-sm font-medium">Mendesak</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {assignments.filter((a) => a.priority === "urgent").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {view === VIEW_TYPES.MONTH && renderMonthView()}
          {view === VIEW_TYPES.WEEK && renderWeekView()}
          {view === VIEW_TYPES.DAY && renderDayView()}
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      <AssignmentModal />
    </div>
  );
}
