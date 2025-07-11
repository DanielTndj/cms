import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Assignment } from "@technician/types";
import { PRIORITY_COLORS } from "@technician/constants/priority";
import { STATUS_COLORS } from "@technician/constants/status";
import { useIsMobile } from "@hooks/useMobile";
import { Calendar, MapPin, User, Clock, Plus } from "lucide-react";
import { formatDate } from "@technician/utils/technicianHelper";

interface DayTasksPopoverProps {
  date: Date;
  assignments: Assignment[];
  technicians: any[];
  children: React.ReactNode;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void; 
  onCreateTask?: (date: Date) => void;
  onViewTask?: (assignment: Assignment) => void;
  onEditTask?: (assignment: Assignment) => void;
}

export function DayTasksPopover({
  date,
  assignments,
  technicians,
  children,
  open,
  onOpenChange,
  onCreateTask,
  onViewTask,
  onEditTask
}: DayTasksPopoverProps) {
  const isMobile = useIsMobile();
  const formattedDate = formatDate(date);
  
  const handleCreateTask = React.useCallback(() => {
    onCreateTask?.(date);
    onOpenChange?.(false); 
  }, [onCreateTask, date, onOpenChange]);

  const handleViewTask = React.useCallback((assignment: Assignment) => {
    onViewTask?.(assignment);
  }, [onViewTask]);

  const handleEditTask = React.useCallback((assignment: Assignment) => {
    onEditTask?.(assignment);
  }, [onEditTask]);
  
  const TaskList = React.memo(() => (
    <div className="space-y-3 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h3 className="font-semibold">{formattedDate}</h3>
        </div>
        <Badge variant="outline">
          {assignments.length} tugas
        </Badge>
      </div>

      {/* Create Task Button */}
      <Button 
        onClick={handleCreateTask}
        className="w-full"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah Tugas Baru
      </Button>

      {/* Tasks List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Tidak ada tugas di tanggal ini</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const techniciansList = assignment.technicianIds
              .map((id) => technicians.find(t => t.id === id)?.name)
              .filter(Boolean)
              .join(", ");

            return (
              <Card 
                key={assignment.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewTask?.(assignment)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            PRIORITY_COLORS[assignment.priority]
                          }`}
                        />
                        <h4 className="font-medium truncate">
                          {assignment.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={STATUS_COLORS[assignment.status]}
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{assignment.locationId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate">{techniciansList}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask?.(assignment);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  ));

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Tugas Tanggal {formattedDate}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <TaskList />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <TaskList />
      </PopoverContent>
    </Popover>
  );
}