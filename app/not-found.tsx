"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text2xl">404 - Page Not Found</h1>
            <p className="text-xl">The page you are looking for does not exist.</p>
            <button onClick={() => router.push("/")} className=" hover:bg-slate-700">Go to Home</button>
        </div>
    );
}