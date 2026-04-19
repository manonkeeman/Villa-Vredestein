import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiBookOpen, FiDollarSign, FiClipboard,
    FiAlertCircle, FiClock, FiCheckCircle, FiCheckSquare, FiSquare, FiTool,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import "./StudentDashboard.css";
import "../../Styles/Global.css";


const getIsoWeek = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const toRotationWeek = (isoWeek) => ((isoWeek - 1) % 4) + 1;

const getWeekDates = (isoWeek, year) => {
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (isoWeek - 1) * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
};

const NL_MONTHS = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

const formatWeekRange = (isoWeek, year) => {
    const { start, end } = getWeekDates(isoWeek, year);
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
        ? `${start.getDate()}–${end.getDate()} ${NL_MONTHS[start.getMonth()]}`
        : `${start.getDate()} ${NL_MONTHS[start.getMonth()]}–${end.getDate()} ${NL_MONTHS[end.getMonth()]}`;
};

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();
    const [contractFile, setContractFile] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);
    const [myTasks, setMyTasks] = useState([]);

    const currentId = user?.id ?? user?.userId;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && currentId && String(id) !== String(currentId)) return <Navigate to="/unauthorized" replace />;

    const now = new Date();
    const currentIsoWeek = getIsoWeek(now);
    const currentYear = now.getFullYear();
    const rotationWeek = toRotationWeek(currentIsoWeek);
    const weekRange = formatWeekRange(currentIsoWeek, currentYear);

    const currentMonth = now.getMonth() + 1;
    const thisMonthInvoice = invoices.find(
        i => Number(i.invoiceMonth) === currentMonth && Number(i.invoiceYear) === currentYear
    );
    const openInvoices = invoices.filter(i => i.status === "OPEN" || i.status === "OVERDUE");
    const hasOverdue = openInvoices.some(i => i.status === "OVERDUE");
    const nextInvoice = [...openInvoices].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
    const formatBedrag = (amount) =>
        amount != null ? new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount) : "—";

    useEffect(() => { setContractFile(user?.contractFile || null); }, [user?.contractFile]);

    useEffect(() => {
        api.get("/api/invoices/me")
            .then(res => setInvoices(res.data || []))
            .catch(() => {
                // Mock fallback: Desmond has unpaid invoices, others are all paid
                const mockMonth = now.getMonth() + 1;
                const mockYear  = now.getFullYear();
                if ((user?.username || "").toLowerCase() === "desmond") {
                    setInvoices([{
                        id: 9001,
                        invoiceMonth: mockMonth,
                        invoiceYear:  mockYear,
                        amount: 350,
                        status: "OVERDUE",
                        dueDate: `${mockYear}-${String(mockMonth).padStart(2,"0")}-05`,
                        checkoutUrl: "https://checkout.mollie.com/mock-desmond",
                    }]);
                } else {
                    setInvoices([{
                        id: 9002,
                        invoiceMonth: mockMonth,
                        invoiceYear:  mockYear,
                        amount: 350,
                        status: "PAID",
                        dueDate: `${mockYear}-${String(mockMonth).padStart(2,"0")}-05`,
                        paidAt: `${mockYear}-${String(mockMonth).padStart(2,"0")}-03`,
                    }]);
                }
            })
            .finally(() => setInvoicesLoading(false));
    }, [user?.username]);

    useEffect(() => {
        // Seed from sessionStorage for instant display
        try {
            const cached = sessionStorage.getItem(`cleaning_rw_${rotationWeek}`);
            if (cached) {
                const all = JSON.parse(cached);
                const mine = all.filter(t => t.assignedTo === user?.username);
                setMyTasks(mine.length > 0 ? mine : all.slice(0, 2));
            }
        } catch { /* ignore */ }

        api.get(`/api/cleaning/tasks?weekNumber=${rotationWeek}`)
            .then(res => {
                const all = res.data || [];
                try { sessionStorage.setItem(`cleaning_rw_${rotationWeek}`, JSON.stringify(all)); } catch { /* ignore */ }
                const mine = all.filter(t => t.assignedTo === user?.username);
                setMyTasks(mine.length > 0 ? mine : all.slice(0, 2));
            })
            .catch(() => {});
    }, [rotationWeek, user?.username]);

    const sidebar = <StudentSidebar user={user} logout={logout} active="dashboard" contractFile={contractFile} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="dashboard-grid">
            <Helmet>
                <title>Mijn Dashboard — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ── Welkom (full-width, goud) ── */}
            <article className="dash-card dash-card--wide dash-card--gold">
                <h2><FiBookOpen /> Fijn dat je er bent, {user?.username || "Vredesteiner"}!</h2>
                <p>Dit is jouw plek in de villa. Hier vind je je schema, betalingen, events en meer.</p>
                <p>Vragen? Stuur een berichtje via <Link to="/contact">Contact</Link> of WhatsApp.</p>
            </article>

            {/* ── Betalingen (groen) ── */}
            <article className={`dash-card ${
                invoicesLoading ? "dash-card--green" :
                thisMonthInvoice?.status === "PAID" ? "dash-card--green" :
                thisMonthInvoice?.status === "OVERDUE" ? "dash-card--red" :
                thisMonthInvoice?.status === "OPEN" ? "dash-card--yellow" :
                "dash-card--green"
            }`}>
                <h2><FiDollarSign /> Betalingen</h2>

                {/* This month's status — most prominent */}
                {!invoicesLoading && (
                    <div className="dash-month-status">
                        {thisMonthInvoice?.status === "PAID" && (
                            <span className="dash-month-badge dash-month-badge--paid">
                                <FiCheckCircle /> Deze maand betaald
                            </span>
                        )}
                        {thisMonthInvoice?.status === "OVERDUE" && (
                            <span className="dash-month-badge dash-month-badge--overdue">
                                <FiAlertCircle /> Betaling verlopen!
                            </span>
                        )}
                        {thisMonthInvoice?.status === "OPEN" && (
                            <span className="dash-month-badge dash-month-badge--open">
                                <FiClock /> Nog te betalen
                            </span>
                        )}
                        {!thisMonthInvoice && invoices.length > 0 && (
                            <span className="dash-month-badge dash-month-badge--none">
                                Nog geen factuur deze maand
                            </span>
                        )}
                    </div>
                )}

                <div className="dashboard-cleaning-meta">
                    {!invoicesLoading && nextInvoice && thisMonthInvoice?.status !== "PAID" && (
                        <span className="week-iso-label">
                            {formatBedrag(nextInvoice.amount)} · vervalt {new Date(nextInvoice.dueDate).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                        </span>
                    )}
                    <Link to="/student/betalingen" className="dashboard-schema-btn" style={{ marginLeft: "auto" }}>
                        <FiDollarSign /> Bekijk
                    </Link>
                </div>
            </article>

            {/* ── Schoonmaakschema (blauw) ── */}
            <article className="dash-card dash-card--blue">
                <h2><MdOutlineCleaningServices /> Schoonmaakschema</h2>
                <div className="dashboard-cleaning-meta" style={{ marginBottom: myTasks.length > 0 ? "0.5rem" : 0 }}>
                    <span className="dashboard-rotation-badge">
                        Week {currentIsoWeek}
                        <span className="week-current-badge">nu</span>
                    </span>
                    <span className="week-iso-label">{weekRange}</span>
                </div>
                {myTasks.length > 0 ? (
                    <ul className="dash-task-list">
                        {myTasks.slice(0, 2).map(t => (
                            <li key={t.id} className={`dash-task-item${t.completed ? " dash-task-item--done" : ""}`}>
                                {t.completed ? <FiCheckSquare className="dash-task-icon done" /> : <FiSquare className="dash-task-icon" />}
                                <span>{t.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Geen taken voor jou deze week.</p>
                )}
                <div className="dashboard-cleaning-meta" style={{ marginTop: "auto" }}>
                    <Link to="/schoonmaakschema" className="dashboard-schema-btn">
                        <FiClipboard /> Bekijk
                    </Link>
                </div>
            </article>

            {/* ── Iets melden (oranje) ── */}
            <article className="dash-card dash-card--orange">
                <h2><FiTool /> Iets melden</h2>
                <p>Defect, beschadiging of klacht? Meld het hier zodat het snel opgepakt kan worden.</p>
                <div className="dashboard-cleaning-meta" style={{ marginTop: "auto" }}>
                    <Link to="/student/meldingen" className="dashboard-schema-btn">
                        <FiTool /> Melding indienen
                    </Link>
                </div>
            </article>
        </DashboardLayout>
    );
};

export default StudentDashboard;
