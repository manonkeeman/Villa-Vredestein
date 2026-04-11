import "./Spinner.css";

export default function Spinner({ label = "Laden…", fullPage = false }) {
    if (fullPage) {
        return (
            <div className="spinner-fullpage" role="status" aria-label={label}>
                <div className="spinner-ring" />
                <span className="spinner-label">{label}</span>
            </div>
        );
    }

    return (
        <span className="spinner-inline" role="status" aria-label={label}>
            <span className="spinner-ring spinner-ring--small" />
        </span>
    );
}