import * as React from "react"
import { cn } from "@/lib/utils"

export type AgentType = 'triage' | 'concepts' | 'debug' | 'exercise'

interface AgentBadgeProps {
  agentType: AgentType
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const agentColors: Record<AgentType, string> = {
  triage: 'bg-agent-triage',
  concepts: 'bg-agent-concepts',
  debug: 'bg-agent-debug',
  exercise: 'bg-agent-exercise',
}

const agentLabels: Record<AgentType, string> = {
  triage: 'Triage',
  concepts: 'Concepts',
  debug: 'Debug',
  exercise: 'Exercise',
}

const agentIcons: Record<AgentType, string> = {
  triage: '🎯',
  concepts: '💡',
  debug: '🐛',
  exercise: '💪',
}

export function AgentBadge({ agentType, className, size = 'md' }: AgentBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
        agentColors[agentType],
        "text-white bg-opacity-20 backdrop-blur-sm",
        sizeClasses[size],
        className
      )}
    >
      <span>{agentIcons[agentType]}</span>
      <span>{agentLabels[agentType]}</span>
    </span>
  )
}
