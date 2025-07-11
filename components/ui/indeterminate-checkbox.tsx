import React, { useRef, useEffect } from 'react';
import { Checkbox } from './checkbox';

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: (checked: boolean) => void;
  [key: string]: any;
}

export const IndeterminateCheckbox = ({ 
  checked, 
  indeterminate, 
  onCheckedChange, 
  ...props 
}: IndeterminateCheckboxProps) => {
  // Keep HTMLButtonElement to match Checkbox component expectation
  const ref = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      // Use type assertion to access indeterminate property
      (ref.current as any).indeterminate = indeterminate;
    }
  }, [indeterminate]);
  
  return (
    <Checkbox
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    />
  );
};