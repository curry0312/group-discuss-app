import { Input } from "~/components/ui/input"

const Friends = () => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-950">
        <div className="flex pt-24">
          <div className="flex flex-1 items-center justify-center">
            <Input
              type="email"
              placeholder="Search..."
              className="w-[90%] bg-slate-900 text-white"
            />
          </div>
        </div>
      </main>
  )
}

export default Friends
