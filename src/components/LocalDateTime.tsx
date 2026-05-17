export default function LocalDateTime({ value }: { value: string }) {
    const d = new Date(value.replace(" ", "T") + "Z");

    const date = d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const time = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });

    return `${date} ${time}`;

}