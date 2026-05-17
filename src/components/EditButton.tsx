"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function EditButton(props : {id : number; className?: string}) {
  const router = useRouter();

  return (
    <Button
      text="Edit"
      variant="secondary"
      className={props.className}
      onClick={() => {
        router.push(`/articles/create-article/load-draft?id=${props.id}`);
      }}
    />
  );
}