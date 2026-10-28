"use client";

import AddButton from "@/components/AddButton";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import { useNotifications } from "@/components/NotificationProvider";
import Tile from "@/components/Tile";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { getDevice } from "@/lib/getDevice";
import { getIcon } from "@/lib/icons";
import resizeImage from "@/lib/resizeImage";
import { ChangePasswordResponse, Session, SiteContent, SocialLink, User } from "@/lib/types";
import { Icon } from "@iconify/react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Unknown";

    const value = date instanceof Date
        ? date
        : new Date(
            typeof date === "string" && !date.includes("T")
                ? date.replace(" ", "T") + "Z"
                : date
        );

    if (isNaN(value.getTime())) {
        return "Invalid date";
    }

    return value.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function SettingsClient(props : {
    user : User, 
    content : SiteContent,
    activeSessions : Session[],
    currentSession : Session,
    links: SocialLink[],
}){

    const router = useRouter();
    const { notify } = useNotifications();

    // Resume file input stuff
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [resumeName, setResumeName] = useState<string | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeDragActive, setResumeDragActive] = useState(false);

    // Headshot file input stuff
    const headshotInputRef = useRef<HTMLInputElement>(null);
    const [headshotName, setHeadshotName] = useState<string | null>(null);
    const [headshotFile, setHeadshotFile] = useState<File | null>(null);
    const [headshotDragActive, setHeadshotDragActive] = useState(false);

    // Password states
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // About me
    const [ about, setAbout ] = useState(props.content.about || "");

    const normalizedLink = (link: string) => {
        const value = link.trim();

        if (!value) return "";

        if (/^mailto:/i.test(value)) {
            return value;
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return `mailto:${value}`;
        }

        return /^https?:\/\//i.test(value)
            ? value
            : `https://${value}`;
    };

    // Social links
    const [links, setLinks] = useState<SocialLink[]>(props.links);
    const [linkName, setLinkName] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [savingLink, setSavingLink] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
    async function handleAddLink(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setSavingLink(true);

            const title = linkName.trim();
            const url = normalizedLink(linkUrl.trim());

            if (!title || !url) {
                notify("Please enter a title and URL", "error");
                return;
            }

            const res = await fetch("/api/links", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, url }),
            });

            const data = await res.json() as any;

            if (!res.ok) {
                notify(data.error || "Failed to add link", "error");
                return;
            }

            setLinks((prev) => [...prev, data.link]);

            setLinkName("");
            setLinkUrl("");

            notify("Link added successfully", "success");
            setShowLinkForm(false);
            router.refresh();
        } catch {
            notify("Failed to add link", "error");
        } finally {
            setSavingLink(false);
        }
    }

    async function handleSaveLink(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const title = linkName.trim();
        const url = normalizedLink(linkUrl);

        if (!title || !url) {
            notify("Please enter a title and URL", "error");
            return;
        }

        try {
            setSavingLink(true);

            const isEditing = editingLinkId !== null;

            const res = await fetch("/api/links", {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...(isEditing ? { id: editingLinkId } : {}),
                    title,
                    url,
                }),
            });

            const data = await res.json() as any;

            if (!res.ok) {
                notify(data.error || "Failed to save link", "error");
                return;
            }

            if (isEditing) {
                setLinks((prev) =>
                    prev.map((link) =>
                        link.id === editingLinkId ? data.link : link
                    )
                );

                notify("Link updated successfully", "success");
            } else {
                setLinks((prev) => [...prev, data.link]);

                notify("Link added successfully", "success");
            }

            setLinkName("");
            setLinkUrl("");
            setEditingLinkId(null);
            setShowLinkForm(false);

            router.refresh();
        } catch {
            notify("Failed to save link", "error");
        } finally {
            setSavingLink(false);
        }
    }

    async function handleRemoveLink(id: number) {
        try {
            const res = await fetch("/api/links", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json() as any;

            if (!res.ok) {
                notify(data.error || "Failed to remove link", "error");
                return;
            }

            setLinks((prev) => prev.filter((link) => link.id !== id));

            notify("Link removed successfully", "success");
            router.refresh();
        } catch {
            notify("Failed to remove link", "error");
        }
    }

    useEffect(() => {
        const resizeTextAreas = () => {
            const textareas = document.querySelectorAll("textarea");
                textareas.forEach((ta) => {
                    ta.style.height = "auto";
                    ta.style.height = ta.scrollHeight + "px";
                }
            );
        }

        resizeTextAreas();

        // run on resize
        window.addEventListener("resize", resizeTextAreas);

        // cleanup
        return () => {
            window.removeEventListener("resize", resizeTextAreas);
        };

    }, []);

    const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!headshotFile) {
            setHeadshotPreview(null);
            return;
        }

        const url = URL.createObjectURL(headshotFile);
        setHeadshotPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [headshotFile]);


    // Handling password change
    async function handlePasswordChange(
        e: React.FormEvent
    ){
        e.preventDefault();

        // Simple password check
        if (newPassword !== confirmPassword){
            notify("Passwords do not match")
            return;
        }

        // Changing password
        const response = await fetch("/api/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        const data = await response.json() as ChangePasswordResponse;

        // Showing success or error message for 300ms
        if (response.ok){
            notify("Password updated", "success")
        } else {
            notify(data.error || "Failed to update password", "error")
        }
    }


    // Resume pdf drop
    const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setResumeDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            notify("Only PDF files are allowed for resume", "error");
            return;
        }

        setResumeFile(file);
        setResumeName(file.name);
    };

    // Resume submit
    const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // No resume file
        if (!resumeFile) {
            notify("Please select a resume first", "error")
            return;
        }

        // Uploading file
        const formData = new FormData();
        formData.append("file", resumeFile);
        formData.append("name", "resume");
        formData.append("type", "pdf");

        const res = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            notify(data.error || "Resume upload failed", "error")
            return;
        }

        // Nullify files
        setResumeFile(null);
        setResumeName(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Success message
        notify("Successfully Uploaded Resume", "success")
    };

    // Resize headshot
    const MAX_SIZE = 0.5 * 1024 * 1024; // Max size is 500kb
    const processHeadshot = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            throw new Error("Only images are allowed");
        }

        let finalFile = await resizeImage(file, 1200, 0.8, 3 / 4);
        while (finalFile.size > MAX_SIZE) {
            finalFile = await resizeImage(finalFile, 1200, 0.8, 3 / 4);
        }

        return finalFile;
    };

    // Headshot image drop
    const handleHeadshotDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setHeadshotDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        try {
            const finalFile = await processHeadshot(file);

            setHeadshotFile(finalFile);
            setHeadshotName(finalFile.name);
        } catch {
            notify("Only images are allowed for headshot", "error");
        }
    };

    // Headshot submit
    const handleHeadshotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // No image
        if (!headshotFile) {
            notify("Please select an image for headshot", "error")
            return;
        }

        // FormData
        const formData = new FormData();
        formData.append("file", headshotFile);
        formData.append("name", "headshot");
        formData.append("type", "image");

        // API call
        const res = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            notify(data.error || "Headshot upload failed", "error")
            return;
        }

        // Nullify files
        setHeadshotFile(null);
        setHeadshotName(null);

        if (headshotInputRef.current) {
            headshotInputRef.current.value = "";
        }

        // Success message
        notify("Successfully uploaded headshot", "success")
    };

    // Updating about me
    async function handleAboutSubmit() {

        if (!about.length){
            notify("Please enter a bio", "error")
            return;
        }

        const res = await fetch("/api/update-about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ about }),
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            notify(data.error || "Failed to update about", "error")

            router.refresh();
            return;
        }

        // Success message
        notify("Successfully changed about me", "success")
    }

    // Clearing all active sessions
    async function handleClearSessions(){
        const res = await fetch("/api/clear-sessions", {
            method: "POST",
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            notify(data.error || "Failed to Clear Sessions", "error")
            return;
        }

        router.refresh();

        // Success message
        notify("Successfully cleared all active sessions", "success")
    }

    // Removing individual session
    async function handleRemoveSession(id: number) {
        const res = await fetch("/api/remove-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        const data = await res.json() as any;

        if (!res.ok) {
            notify(data.error || "Failed to remove session", "error")
            return;
        }

        await router.refresh();

        notify("Successfully removed session", "success")
    }

    return (
        <div className="
            min-h-[90dvh]
            flex flex-wrap justify-center items-center
        ">
            <div
                className="
                    flex flex-wrap
                    justify-center
                    w-full
                    min-h-[90dvh]
                "
            >

                {/* INFO & ABOUT */}
                <Tile 
                    title="Profile Settings"
                    disableHover={true}
                    className="lg:max-w-[40vw] shadow-none pb-0"
                    childClassName="flex-1 justify-center mt-0! justify-start!"
                    titleClassName="border-b"
                >

                    {/* ABOUT ME */}
                    <div className="space-y-4 py-6 border-b">
                        <h2 className="text-xl">
                            About Me
                        </h2>
                        <div className="flex flex-col gap-4">
                            <textarea
                                name="about-me"
                                value={about}
                                className="
                                    w-full
                                    min-h-28
                                    rounded-md
                                    text-sm
                                    text-gray-700
                                    bg-gray-50
                                "
                                rows={1}
                                style={{
                                    overflow: "hidden",
                                    resize: "none",
                                }}
                                onChange={(e) => {
                                    setAbout(e.target.value)
                                    if (e.target instanceof HTMLTextAreaElement) {
                                        const el = e.target;
                                        el.style.height = "auto";
                                        el.style.height = el.scrollHeight + "px";
                                    }
                                }}
                            />

                            <Button
                                text="Change About"
                                className="w-full sm:w-fit"
                                x={4}
                                y={2}
                                onClick={handleAboutSubmit}
                            />                            
                        </div>
                    </div>

                    {/* RESUME UPLOAD */}
                    <div className="py-6 border-b sm:border-b-0">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleResumeSubmit}
                        >
                            <h2 className="text-xl">
                                Upload New Resume
                            </h2>

                            <div
                                className={`
                                    relative
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-3
                                    min-h-40
                                    p-4
                                    rounded-xl
                                    border-2
                                    border-dashed
                                    transition-all
                                    duration-(--transition-duration)
                                    cursor-pointer
                                    ${
                                        resumeDragActive
                                            ? "border-gray-500 bg-gray-100"
                                            : "border-gray-300 bg-gray-50"
                                    }
                                `}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setResumeDragActive(true);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setResumeDragActive(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setResumeDragActive(false);
                                }}
                                onDrop={handleResumeDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    ref={fileInputRef}
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        if (file.type !== "application/pdf") {
                                            notify(
                                                "Only PDF files are allowed for resume",
                                                "error"
                                            );
                                            return;
                                        }

                                        setResumeFile(file);
                                        setResumeName(file.name);
                                    }}
                                />

                                {resumeName ? (
                                    <>
                                        <div className="text-center">
                                            <p className="text-lg font-medium">
                                                PDF selected
                                            </p>

                                            <p className="text-sm text-gray-500 wrap-break-word">
                                                {resumeName}
                                            </p>

                                            {resumeFile && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Click or drop another PDF to replace
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <p className="font-medium">
                                            Drag & drop your resume here
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            or click to select a PDF
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button
                                text="Submit Resume"
                                type="submit"
                                className="w-full sm:w-fit"
                                x={4}
                                y={2}
                            />
                        </form>
                    </div>

                </Tile>

                {/* SECURITY */}
                <Tile
                    className="lg:max-w-[40vw] shadow-none pb-0"
                    disableHover={true}
                    childClassName="mt-0! flex-1 justify-center"
                >

                    {/* Links section */}
                    <div className="space-y-4 py-6 border-b">
                        <h2 className="text-xl">Social Links</h2>

                        {/* Existing links */}
                        <div className="flex flex-wrap gap-3">
                            {links.length === 0 && (
                                <div className="text-sm text-gray-400">
                                    No links added yet
                                </div>
                            )}

                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="
                                        flex 
                                        items-center 
                                        gap-4
                                        min-w-0 
                                        max-w-full
                                        p-3 
                                        pillow 
                                        pillow-hover
                                        hover:scale-(--subtle-scale)
                                        squircle-medium
                                        w-full
                                        lg:w-fit
                                        shadow-[0_5px_12px_rgba(0,0,0,0.12),0_-1px_4px_rgba(0,0,0,0.06)]
                                    "
                                >
                                    <a
                                        href={link.url}
                                        aria-label={`${link.title} profile`}
                                        target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                                        rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                        className="
                                            flex items-center gap-2
                                            min-w-0 flex-1
                                        "
                                    >
                                        <span className="
                                            flex 
                                            shrink-0 
                                            items-center 
                                            justify-center
                                            w-7 h-7 
                                            bg-black 
                                            squircle
                                            pillow-black
                                            pillow-hover-black
                                        ">
                                            <Icon
                                                icon={getIcon(link.url)}
                                                width={18}
                                                height={18}
                                                color="white"
                                            />
                                        </span>

                                        <span className="font-medium truncate">
                                            {link.title}
                                        </span>
                                    </a>

                                    <EditButton
                                        action={() => {
                                            setEditingLinkId(link.id);
                                            setLinkName(link.title);
                                            setLinkUrl(link.url);
                                            setShowLinkForm(true);
                                        }}
                                        x={3}
                                        y={1}
                                    />

                                    <DeleteButton
                                        action={() => handleRemoveLink(link.id)}
                                        itemName={link.title}
                                        x={3}
                                        y={1}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Add link form */}
                        {showLinkForm ? (
                            <form
                                onSubmit={handleSaveLink}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="link-name"
                                        className="text-gray-500"
                                    >
                                        Link Title
                                    </label>

                                    <input
                                        id="link-name"
                                        type="text"
                                        value={linkName}
                                        onChange={(e) => setLinkName(capitalizeNamesAndTitles(e.target.value))}
                                        placeholder="e.g. GitHub"
                                        maxLength={100}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="link-url"
                                        className="text-gray-500"
                                    >
                                        URL
                                    </label>

                                    <input
                                        id="link-url"
                                        type="text"
                                        inputMode="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://github.com/username or email@example.com"
                                        maxLength={2048}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        text={
                                            savingLink
                                                ? editingLinkId !== null ? "Saving..." : "Adding..."
                                                : editingLinkId !== null ? "Save Changes" : "Save Link"
                                        }
                                        type="submit"
                                        className="w-full sm:w-fit"
                                        x={4}
                                        y={2}
                                    />

                                    <Button
                                        text="Cancel"
                                        type="button"
                                        variant="secondary"
                                        className="w-full sm:w-fit"
                                        x={4}
                                        y={2}
                                        onClick={() => {
                                            setShowLinkForm(false);
                                            setEditingLinkId(null);
                                            setLinkName("");
                                            setLinkUrl("");
                                        }}
                                    />
                                </div>
                            </form>
                        ) : (
                            <AddButton
                                action={() => setShowLinkForm(true)}
                                x={4}
                                y={2}
                                text="Add Link"
                            />
                        )}
                    </div>

                    {/* Change password section */}
                    <div className="space-y-4 py-6 border-b">
                        <h2 className="text-xl">
                            Change Password
                        </h2>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="current-password"
                                className="text-gray-500"
                            >
                                Current Password
                            </label>
                            <div className="flex gap-2 w-full">
                                <input
                                    id="current-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="flex-1"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="
                                        cursor-pointer 
                                        flex-0 
                                        mb-2
                                        rounded-md p-1
                                    "
                                    onClick={() => setShowPassword((p) => !p)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (

                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            <label
                                htmlFor="new-password"
                                className="text-gray-500"
                            >
                                New Password
                            </label>
                            <div className="flex w-full">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    name="new-password"
                                    className="flex-1"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <label
                                htmlFor="confirm-new-password"
                                className="text-gray-500"
                            >
                                Confirm New Password
                            </label>
                            <div className="flex w-full">
                                <input
                                    id="confirm-new-password"
                                    type={showPassword ? "text" : "password"}
                                    name="confirm-new-password"
                                    className="flex-1"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex pt-2">
                                <Button 
                                    text="Change Password" 
                                    type="submit"
                                    className="w-full sm:w-fit"
                                    x={4}
                                    y={2}
                                    onClick={handlePasswordChange}
                                />  
                            </div>
                          
                        
                        </div>
                        
                    </div>

                    {/* Active sessions */}
                    <div className="py-6">
                        <h2 className="text-xl mb-4">
                            Active Sessions
                        </h2>
                        <div className="space-y-2 [&_span]:text-gray-500">
                            {props.activeSessions.map((session : Session) => (
                                <details 
                                    key={session.id} 
                                    className="
                                        bg-gray-100 
                                        wrap-break-word 
                                        pillow
                                        squircle-large
                                    "
                                >
                                    <summary className="
                                        cursor-pointer 
                                        font-medium
                                        flex
                                        items-center
                                        justify-between
                                        p-4
                                        squircle-large
                                        pillow-hover-dark
                                        transition-all
                                        duration-(--transition-duration)
                                    ">
                                        <div>
                                            <p>
                                                {getDevice(session.user_agent)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Session {session.id}
                                            </p>
                                        </div>
                                        
                                        {props.currentSession.id === session.id && (
                                            <span className="
                                                text-sm
                                                text-gray-500
                                                bg-gray-200
                                                px-2
                                                py-1
                                                rounded-full
                                            ">
                                                Current
                                            </span>
                                        )}
                                    </summary>

                                    <div className="space-y-1 p-4 pt-0">
                                        <p><span>Device: </span>{getDevice(session.user_agent)}</p>
                                        <p><span>IP Address: </span>{session.ip_address}</p>
                                        <p>
                                            <span>Location: </span>
                                            {(() => {
                                                try {
                                                    const geo = JSON.parse(session.geo);
                                                    return `${geo.city}, ${geo.country}`;
                                                } catch {
                                                    return session.geo;
                                                }
                                            })()}
                                        </p>
                                        <p>
                                            <span>Created: </span>
                                            {new Date(session.created_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p>
                                            <span>Expires: </span>
                                            {new Date(session.expires_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>       
                                        {props.currentSession.id !== session.id && (
                                            <DeleteButton
                                                buttonText="Remove Session"
                                                actionName="Remove"
                                                itemName="Session"
                                                className="w-full sm:w-fit"
                                                x={2}
                                                y={0}
                                                action={() => handleRemoveSession(session.id)}
                                            />
                                        )}                              
                                    </div>
                                    
     

                                </details>
                            ))}
                            <DeleteButton
                                buttonText="Clear All Sessions"
                                actionName="Clear"
                                itemName="All Sessions"
                                className="w-full sm:w-fit mt-6"
                                x={4}
                                y={2}
                                action={handleClearSessions}
                            />                             
                        </div>

                    </div>
                </Tile>


            </div>

        </div>
    );
}