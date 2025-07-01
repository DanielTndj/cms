"use client";

import { WeekViewProps } from "@/features/technician/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/features/technician/constants/technicianConstant";
import { isSameDay } from "@/features/technician/utils/technicianHelper";

export function WeekView({
  calendarDays,
  getAssignmentsForDate,
  technicians,
  handleView,
}: WeekViewProps) {
  return (
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
                    .map((id) => technicians.find(t => t.id === id)?.name)
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
                      onClick={() => handleView(assignment)}
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
}