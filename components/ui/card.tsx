import * as React from "react"

import { cn } from "@lib/utils"

interface ColoredCardProps extends React.ComponentProps<typeof Card> {
  variant?: 'default' | 'red' | 'blue' | 'green' | 'yellow' | 'orange';
}

const colorVariants = {
  default: "",
  red: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  blue: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
  green: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
  yellow: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
  orange: "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
};
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

function ColoredCard({ variant = 'default', className, ...props }: ColoredCardProps) {
  return (
    <Card 
      className={cn(colorVariants[variant], className)} 
      {...props} 
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ColoredCard
}
