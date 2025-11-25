"use client"

import { AlertTriangle, X, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PendingPaymentAlertProps {
  pendingAmount: number
  pendingCount: number
}

export default function PendingPaymentAlert({ pendingAmount, pendingCount }: PendingPaymentAlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || pendingAmount === 0) return null

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Payment Pending!</h3>
            <p className="text-red-700 mt-1">
              You have {pendingCount} pending payment{pendingCount > 1 ? "s" : ""} totaling{" "}
              <span className="font-bold inline-flex items-center">
                <IndianRupee className="h-4 w-4" />
                {pendingAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-red-600 mt-1">Please clear your dues to avoid any inconvenience.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
