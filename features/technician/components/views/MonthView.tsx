"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { MonthViewProps } from "@/features/technician/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/features/technician/constants/technicianConstant";
import { isSameDay } from "@/features/technician/utils/technicianHelper";

export function MonthView({
  calendarDays,
  currentDate,
  selectedDate,
  setSelectedDate,
  getAssignmentsForDate,
  technicians,
  handleCreate,
  handleView,
}: MonthViewProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  return (
    <div className="grid grid-cols-7 gap-px bg-border">
      {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
        <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => {
        const dayKey = day.toISOString();
        const dayAssignments = getAssignmentsForDate(day);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isExpanded = expandedDays[dayKey] || false;
        const visibleAssignments = isExpanded ? dayAssignments : dayAssignments.slice(0, 3);

        return (
          <div
            key={index}
            className={`bg-background p-2 min-h-32 cursor-pointer hover:bg-muted/50 transition-colors ${
              !isCurrentMonth ? "text-muted-foreground" : ""
            }`}
            onClick={() => setSelectedDate(new Date(day))}
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
                    handleCreate(new Date(day));
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="space-y-1 max-h-[120px] overflow-y-auto">
              {visibleAssignments.map((assignment) => {
                const techniciansList = assignment.technicianIds
                  .map((id) => technicians.find(t => t.id === id)?.name)
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
                      handleView(assignment);
                    }}
                  >
                    <div className="font-medium truncate">
                      {assignment.title}
                    </div>
                    <div className="truncate opacity-90">{techniciansList}</div>
                  </div>
                );
              })}
            </div>

            {dayAssignments.length > 3 && (
              <button
                className="w-full mt-1 flex items-center justify-center text-xs text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedDays(prev => ({
                    ...prev,
                    [dayKey]: !isExpanded
                  }));
                }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Lebih sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    +{dayAssignments.length - 3} lainnya
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}