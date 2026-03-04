"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleEmployee } from "@/lib/actions/employee-actions";
import { useRouter } from "next/navigation";

interface ToggleEmployeeButtonProps {
  employeeId: string;
  isActive: boolean;
}

export function ToggleEmployeeButton({ employeeId, isActive }: ToggleEmployeeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);
    await toggleEmployee(employeeId, !isActive);
    router.refresh();
    setIsLoading(false);
  }

  return (
    <Button
      size="sm"
      variant={isActive ? "destructive" : "outline"}
      disabled={isLoading}
      onClick={handleToggle}
    >
      {isLoading ? "..." : isActive ? "Désactiver" : "Activer"}
    </Button>
  );
}
