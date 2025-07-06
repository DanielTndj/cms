import { Assignment } from "@technician/types";
import { PRIORITY_COLORS } from "@technician/constants/priority";
import { cn } from "@lib/utils";

interface TaskIndicatorProps {
  assignment: Assignment;
  isCompact?: boolean;
  onClick?: () => void;
}

export function TaskIndicator({ assignment, isCompact = false, onClick }: TaskIndicatorProps) {
  if (isCompact) {
    // Mobile compact view
    return (
      <div 
        className={cn(
          "w-2 h-2 rounded-full mb-1 cursor-pointer",
          PRIORITY_COLORS[assignment.priority]
        )}
        onClick={onClick}
        title={`${assignment.title} - ${assignment.priority}`}
      />
    );
  }

  // Desktop detailed view
  return (
    <div 
      className={cn(
        "text-xs p-1 rounded mb-1 cursor-pointer truncate",
        PRIORITY_COLORS[assignment.priority],
        "text-white font-medium"
      )}
      onClick={onClick}
    >
      {assignment.title}
    </div>
  );
}