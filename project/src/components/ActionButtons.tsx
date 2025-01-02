import React from 'react'
import { Button } from './Button'
import { Camera, QrCode, UserPlus } from 'lucide-react'

interface ActionButtonsProps {
  onScanClick: () => void
  onManualClick: () => void
  onAddGuestClick: () => void
}

export function ActionButtons({ onScanClick, onManualClick, onAddGuestClick }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button 
        onClick={onScanClick} 
        className="flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Camera className="w-5 h-5 mr-2" />
        Scan QR Code
      </Button>
      <Button 
        onClick={onManualClick} 
        className="flex items-center justify-center hover:scale-105 transition-transform"
      >
        <QrCode className="w-5 h-5 mr-2" />
        Check by Code
      </Button>
      <Button 
        onClick={onAddGuestClick} 
        className="flex items-center justify-center hover:scale-105 transition-transform"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Add Guest
      </Button>
    </div>
  )
}