"use client";

import React, { useState, useMemo } from "react";
import { VIEW_TYPES, ViewType } from "@technician/constants/views";
import { useAssignmentTechnician } from "@technician/hooks/useAssignmentTechnician";
import { technicianApi, locationApi, assignmentApi } from "@technician/services/api";
import { useApi } from "@technician/hooks/useApi";
import { generateCalendarDays, generateWeekDays, formatDate, isSameDay, getTechnicianOptions } from "@technician/utils/technicianHelper";
import { CalendarHeader } from "../ui/CalendarHeader";
import { StatsCards } from "../ui/StatsCard";
import { AssignmentModal } from "../modals/AssignmentModal";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { Card, CardContent } from "@components/ui/card";
import { AssignmentFormData } from "@technician/types";

export default function TechnicianAssignmentCalendar() {
  // ✅ 1. Semua useState hooks dulu
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>(VIEW_TYPES.MONTH);

  // ✅ 2. Semua useApi hooks dulu (jangan conditional)
  const { data: assignments, loading: assignmentsLoading, error: assignmentsError } = useApi(
    () => assignmentApi.getAssignments(),
    []
  );
  
  const { data: technicians, loading: techniciansLoading } = useApi(
    () => technicianApi.getTechnicians(),
    []
  );
  
  const { data: locations, loading: locationsLoading } = useApi(
    () => locationApi.getLocations(),
    []
  );

  // ✅ 3. Custom hooks setelah built-in hooks
  const {
    assignments: managedAssignments,
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
  } = useAssignmentTechnician(assignments || []);

  // ✅ 4. useMemo hooks
  const calendarDays = useMemo(() => {
    if (view === VIEW_TYPES.MONTH) return generateCalendarDays(currentDate);
    if (view === VIEW_TYPES.WEEK) return generateWeekDays(currentDate);
    return [currentDate];
  }, [currentDate, view]);

  const technicianOptions = useMemo(() => 
    getTechnicianOptions(technicians || []), 
    [technicians]
  );

  // ✅ 5. SETELAH semua hooks, baru conditional rendering
  const isLoading = assignmentsLoading || techniciansLoading || locationsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (assignmentsError) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Error: {assignmentsError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ✅ 6. Function definitions setelah hooks
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

  const getAssignmentsForDate = (date: Date) => {
    return managedAssignments.filter((assignment) =>
      isSameDay(new Date(assignment.date), date)
    );
  };

  const getViewTitle = () => {
    if (view === VIEW_TYPES.MONTH) {
      return currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    } else if (view === VIEW_TYPES.WEEK) {
      const startOfWeek = new Date(calendarDays[0]);
      const endOfWeek = new Date(calendarDays[6]);
      return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    } else {
      return formatDate(currentDate);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: AssignmentFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ 7. Return JSX di akhir
  return (
    <div className="mx-auto space-y-4 p-4">
      <CalendarHeader
        view={view}
        setView={setView}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        goToToday={goToToday}
        getViewTitle={getViewTitle}
        handleCreate={handleCreate}
      />

      <StatsCards assignments={managedAssignments} />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {technicians && locations && (
            <>
              {view === VIEW_TYPES.MONTH && (
                <MonthView
                  calendarDays={calendarDays}
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  getAssignmentsForDate={getAssignmentsForDate}
                  technicians={technicians}
                  handleCreate={handleCreate}
                  handleView={handleView}
                />
              )}
              {view === VIEW_TYPES.WEEK && (
                <WeekView
                  calendarDays={calendarDays}
                  getAssignmentsForDate={getAssignmentsForDate}
                  technicians={technicians}
                  handleView={handleView}
                />
              )}
              {view === VIEW_TYPES.DAY && (
                <DayView
                  currentDate={currentDate}
                  getAssignmentsForDate={getAssignmentsForDate}
                  locations={locations}
                  technicians={technicians}
                  handleView={handleView}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AssignmentModal
        showModal={showModal}
        modalMode={modalMode}
        selectedAssignment={selectedAssignment}
        formData={formData}
        technicians={technicians || []}
        locations={locations || []}
        technicianOptions={technicianOptions}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleStatusChange={handleStatusChange}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}