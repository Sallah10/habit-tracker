// app/not-found.tsx
"use client";
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p>Could not find the requested resource</p>
            <Link href="/" className="mt-4 underline">Return Home</Link>
        </div>
    );
}