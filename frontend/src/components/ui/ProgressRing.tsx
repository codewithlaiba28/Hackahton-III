import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
  animated?: boolean
  status?: 'beginner' | 'learning' | 'proficient' | 'mastered'
}

const statusColors = {
  beginner: '#e8004d',    // Crimson
  learning: '#f59e0b',    // Orange
  proficient: '#10b981',  // Green
  mastered: '#3b82f6',    // Blue
}

const getColorForScore = (score: number): 'beginner' | 'learning' | 'proficient' | 'mastered' => {
  if (score <= 40) return 'beginner'
  if (score <= 70) return 'learning'
  if (score <= 90) return 'proficient'
  return 'mastered'
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  className,
  animated = true,
  status,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = React.useState(animated ? circumference : 0)

  const finalStatus = status || getColorForScore(percentage)
  const color = statusColors[finalStatus]

  React.useEffect(() => {
    if (animated) {
      const targetOffset = circumference - (percentage / 100) * circumference
      setOffset(targetOffset)
    }
  }, [percentage, circumference, animated])

  const center = size / 2

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(232,0,77,0.3)]"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  )
}
