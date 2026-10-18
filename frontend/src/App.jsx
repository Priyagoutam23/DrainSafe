
function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 p-6 text-white md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold">
            D
          </div>
          <div>
            <h1 className="text-xl font-bold">DrainSafe</h1>
            <p className="text-xs text-slate-400">Infrastructure intelligence</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <a href="#overview" className="block rounded-lg bg-emerald-700 px-4 py-3 font-medium">
            Overview
          </a>
          <a href="#assets" className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            Drainage Assets
          </a>
          <a href="#reports" className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            Issue Reports
          </a>
          <a href="#maintenance" className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            Maintenance History
          </a>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-700 p-4">
          <p className="font-medium">DrainSafe MVP</p>
          <p className="mt-1 text-xs text-slate-400">
            Learning and development build
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">

        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h2 className="mt-1 text-lg font-semibold">Drainage Operations</h2>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            Demo data
          </span>
        </header>

        {/* Dashboard */}
        <main id="overview" className="mx-auto max-w-7xl p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-emerald-700">
              DRAINSAFE / DASHBOARD
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Good morning!
            </h1>
            <p className="mt-2 text-slate-500">
              Monitor drainage assets, reported issues and maintenance activity.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Registered assets</p>
              <p className="mt-3 text-3xl font-bold">128</p>
              <p className="mt-2 text-sm text-slate-500">Sample drainage records</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Open reports</p>
              <p className="mt-3 text-3xl font-bold">18</p>
              <p className="mt-2 text-sm text-amber-700">Awaiting review or action</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Repeat-failure alerts</p>
              <p className="mt-3 text-3xl font-bold">7</p>
              <p className="mt-2 text-sm text-rose-700">Potential recurring problems</p>
            </div>

          </div>

          {/* Next section placeholder */}
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
            <h2 className="text-lg font-semibold">Drainage activity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Next, we will add the reports table, drainage asset details and location map here.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
