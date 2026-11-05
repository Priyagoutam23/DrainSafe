import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 font-medium transition ${
      isActive
        ? "bg-emerald-700 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col bg-slate-950 p-6 text-white md:flex ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold">
            D
          </div>

          <div>
            <h1 className="text-xl font-bold">DrainSafe</h1>
            <p className="text-xs text-slate-400">
              Infrastructure intelligence
            </p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <NavLink to="/" end className={navClass} onClick={closeMenu}>
            Overview
          </NavLink>

          <NavLink to="/assets" className={navClass} onClick={closeMenu}>
            Drainage Assets
          </NavLink>

          <NavLink to="/reports" className={navClass} onClick={closeMenu}>
            Issue Reports
          </NavLink>

          <NavLink to="/maintenance" className={navClass} onClick={closeMenu}>
            Maintenance History
          </NavLink>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-700 p-4">
          <p className="font-medium">DrainSafe MVP</p>
          <p className="mt-1 text-xs text-slate-400">
            Infrastructure management system
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xl md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <div>
            <p className="text-sm text-slate-500">Workspace / DrainSafe</p>

            <h2 className="mt-1 text-lg font-semibold">Drainage Operations</h2>
          </div>

          <span className="ml-auto rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            MVP
          </span>
        </header>

        {/* Current page */}
        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

// Iska purpose kya hai?
// - NavLink pages ke beech navigation karega.
// - Outlet selected page ka content display karega.
// - Sidebar aur header har page par common rahenge.
