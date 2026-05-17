"use client";

import Button from "@/components/Button";
import { useEffect, useState, useTransition } from "react";

export default function DeleteButton({
  action,
  className = "",
}: {
  action: () => void;
  className?: string;
}) {

    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await action();
        });
    };

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    return (
        <>
            <Button
                text="Delete Article"
                type="button"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setOpen(true)}
            />
            {open && (
                <div 
                    className="
                    fixed inset-0 
                    bg-black/50 
                    flex items-center justify-center
                    z-50"
                >
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">
                            Delete article?
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            This action cannot be undone.
                        </p>


                        <div className="flex justify-between gap-3">

                            <Button
                                text="Cancel"
                                variant="secondary"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                
                            </Button>
                            <Button
                                text="Delete"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    setOpen(false);
                                    handleDelete();
                                }}
                                disabled={isPending}
                            >

                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}