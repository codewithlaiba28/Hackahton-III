import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  Users,
  BarChart3,
  MessageSquare,
  Code2,
  Trophy
} from "lucide-react"

interface AppShellProps {
  children: React.ReactNode
  role?: 'student' | 'teacher'
  userName?: string
  onLogout?: () => void
}

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
  { icon: BookOpen, label: 'Learn', href: '/student/workspace' },
  { icon: BarChart3, label: 'Progress', href: '/student/progress' },
  { icon: Trophy, label: 'Quizzes', href: '/student/quiz' },
]

const teacherNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/teacher/dashboard' },
  { icon: Users, label: 'Students', href: '/teacher/students' },
  { icon: MessageSquare, label: 'Exercises', href: '/teacher/exercises' },
  { icon: Code2, label: 'Analytics', href: '/teacher/analytics' },
]

export function AppShell({ 
  children, 
  role = 'student', 
  userName,
  onLogout 
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const navItems = role === 'student' ? studentNavItems : teacherNavItems

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-learnflow-bg-surface border-r border-border",
          "transform transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              LearnFlow
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all hover-glow"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {userName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                {userName || 'User'}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {role}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-4">
              {/* Add notifications, settings, etc. here */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
