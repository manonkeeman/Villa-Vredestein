import React, { useState, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";

/**
 * Shared layout wrapper for all dashboard pages.
 * Handles the mobile sidebar hamburger → dropdown.
 *
 * Props:
 *   sidebar   — the <aside> JSX to render as the sidebar
 *   mainClass — extra CSS class(es) to add to <main> (e.g. "ev-main")
 *   rootClass — extra CSS class(es) to add to the root wrapper
 *   children  — the main page content (no need to wrap in <main>)
 */
export default function DashboardLayout({ sidebar, mainClass = "", rootClass = "", children }) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    return (
        <div className={`StudentDashboard${open ? " sidebar-open" : ""}${rootClass ? ` ${rootClass}` : ""}`}>
            {/* Mobile hamburger — hidden on desktop via CSS */}
            <button
                type="button"
                className="sidebar-mobile-toggle"
                onClick={() => setOpen(o => !o)}
                aria-label={open ? "Menu sluiten" : "Menu openen"}
                aria-expanded={open}
            >
                {open ? <FiX size={16} /> : <FiMenu size={16} />}
                <span>{open ? "Sluiten" : "Menu"}</span>
            </button>

            {/* Overlay — closes menu on tap outside */}
            {open && (
                <div
                    className="sidebar-overlay"
                    onClick={close}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar — any link click also closes the menu */}
            <div style={{ display: "contents" }} onClick={close}>
                {sidebar}
            </div>

            {/* Main content */}
            <main className={`dashboard-main${mainClass ? ` ${mainClass}` : ""}`}>
                {children}
            </main>
        </div>
    );
}
