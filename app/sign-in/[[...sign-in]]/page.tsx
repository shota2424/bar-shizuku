import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BAR雫</h1>
          <p className="text-muted-foreground mt-1">管理システム</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
