import * as React from "react"
import { cn } from "@/lib/utils"
import { ProgressRing } from "@/components/ui/ProgressRing"
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react"

export type MasteryStatus = 'beginner' | 'learning' | 'proficient' | 'mastered'

interface MasteryCardProps {
  moduleName: string
  masteryScore: number
  status?: MasteryStatus
  trend?: 'up' | 'down' | 'stable'
  className?: string
  onClick?: () => void
}

const statusLabels: Record<MasteryStatus, string> = {
  beginner: 'Initiated',
  learning: 'Synchronizing',
  proficient: 'Optimized',
  mastered: 'Architect',
}

const statusBorderColors: Record<MasteryStatus, string> = {
  beginner: 'border-neon-crimson/30',
  learning: 'border-yellow-500/30',
  proficient: 'border-green-500/30',
  mastered: 'border-blue-500/30',
}

const statusTextColors: Record<MasteryStatus, string> = {
  beginner: 'text-neon-crimson',
  learning: 'text-yellow-500',
  proficient: 'text-green-500',
  mastered: 'text-blue-500',
}

export function MasteryCard({
  moduleName,
  masteryScore,
  status,
  trend = 'stable',
  className,
  onClick,
}: MasteryCardProps) {
  const finalStatus = status || getStatusFromScore(masteryScore)

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[trend]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border glass-card p-8 transition-all duration-500 bg-black/40",
        "hover:scale-[1.02] hover:shadow-neon cursor-pointer",
        statusBorderColors[finalStatus],
        className
      )}
      onClick={onClick}
    >
      {/* Background Icon Decor */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
        <Zap className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">
            {moduleName}
          </h3>
          <div className="p-2 rounded-lg bg-white/5">
            <TrendIcon className={cn(
              "h-4 w-4",
              trend === 'up' ? 'text-green-500 shadow-glow' :
                trend === 'down' ? 'text-neon-crimson shadow-neon' :
                  'text-white/20'
            )} />
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 blur-lg opacity-20",
              finalStatus === 'beginner' ? 'bg-neon-crimson' :
                finalStatus === 'learning' ? 'bg-yellow-500' :
                  finalStatus === 'proficient' ? 'bg-green-500' :
                    'bg-blue-500'
            )} />
            <ProgressRing
              percentage={masteryScore}
              size={90}
              strokeWidth={10}
              status={finalStatus}
            />
          </div>

          <div className="flex-1">
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-1">
              Neural Index
            </div>
            <div className="text-3xl font-display font-bold text-white tracking-tight mb-2">
              {masteryScore.toFixed(0)}%
            </div>
            <div className={cn(
              "inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold tracking-tight bg-white/5 border border-white/10",
              statusTextColors[finalStatus]
            )}>
              {statusLabels[finalStatus]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusFromScore(score: number): MasteryStatus {
  if (score <= 40) return 'beginner'
  if (score <= 70) return 'learning'
  if (score <= 90) return 'proficient'
  return 'mastered'
}
