"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => router.push("/")}>Go to Home</button>
        </div>
    );
}