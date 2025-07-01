"use client";

import React, { useState, useMemo } from "react";
import { VIEW_TYPES, ViewType } from "@/features/technician/constants/technicianConstant";
import { useAssignmentTechnician } from "@/features/technician/hooks/useAssignmentTechnician";
import { technicians, locations, sampleAssignments } from "@/features/technician/data/mockData";
import { generateCalendarDays, generateWeekDays, formatDate, isSameDay, getTechnicianOptions } from "@/features/technician/utils/technicianHelper";
import { CalendarHeader } from "./CalendarHeader";
import { StatsCards } from "./StatsCard";
import { AssignmentModal } from "./AssignmentModal";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { Card, CardContent } from "@/components/ui/card";

export default function TechnicianAssignmentCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>(VIEW_TYPES.MONTH);

  const {
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
  } = useAssignmentTechnician(sampleAssignments);

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

  const calendarDays = useMemo(() => {
    if (view === VIEW_TYPES.MONTH) return generateCalendarDays(currentDate);
    if (view === VIEW_TYPES.WEEK) return generateWeekDays(currentDate);
    return [currentDate];
  }, [currentDate, view]);

  const technicianOptions = useMemo(() => getTechnicianOptions(technicians), [technicians]);

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter((assignment) =>
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

      <StatsCards assignments={assignments} />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
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
        </CardContent>
      </Card>

      <AssignmentModal
        showModal={showModal}
        modalMode={modalMode}
        selectedAssignment={selectedAssignment}
        formData={formData}
        technicians={technicians}
        locations={locations}
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