"use client";

export default function LocalDate({ value }: { value: string }) {
    return (
        <span>
            {new Date(value).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
        </span>
    );
}