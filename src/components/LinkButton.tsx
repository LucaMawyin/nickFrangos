"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function LinkButton(props : {
    link : string; 
    text : string;
    className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      text={props.text}
      onClick={() =>
        router.push(props.link)
      }
      className={props.className}
    />
  );
}