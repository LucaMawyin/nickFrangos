"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function EditButton(props : {slug : string; className?: string}) {
  const router = useRouter();

  return (
    <Button
      text="Edit"
      variant="secondary"
      className={props.className}
      onClick={() => {
        router.push(`/articles/create-article/load-draft?slug=${props.slug}`);
      }}
    />
  );
}