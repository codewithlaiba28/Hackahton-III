import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-learnflow-bg-primary text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        ✅ LearnFlow UI is Working!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Tailwind CSS + shadcn/ui successfully configured
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-learnflow-bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Theme Colors</h2>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-learnflow-bg-primary border border-border" />
            <div className="w-12 h-12 rounded bg-learnflow-bg-surface border border-border" />
            <div className="w-12 h-12 rounded bg-primary" />
          </div>
        </div>

        <div className="bg-learnflow-bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Status Colors</h2>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded bg-status-beginner" />
            <div className="w-12 h-12 rounded bg-status-learning" />
            <div className="w-12 h-12 rounded bg-status-proficient" />
            <div className="w-12 h-12 rounded bg-status-mastered" />
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Navigate to <Link href="/student/dashboard" className="text-primary hover:underline">/student/dashboard</Link> for the main dashboard
      </p>
    </div>
  )
}
