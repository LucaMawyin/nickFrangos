"use client";

import { useRouter } from "next/navigation";
import EditButton from "./EditButton";

export default function EditArticleButton({
    articleId,
    className = "",
}: {
    articleId: number;
    className?: string;
}) {
    const router = useRouter();

    return (
        <EditButton
            className={className}
            action={() => router.push(`/articles/edit/${articleId}`)}
        />
    );
}