import { useEffect } from "react";

export default function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Aubrey&family=Nunito+Sans:wght@300;400;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    return null;
}