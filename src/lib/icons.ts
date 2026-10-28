import { getIconData } from "@iconify/utils";
import simpleIcons from "@iconify/json/json/simple-icons.json";
import type { IconifyJSON } from "@iconify/types";

const icons = simpleIcons as IconifyJSON;
export const getIcon = (href: string) => {
    try {
        if (href.toLowerCase().startsWith("mailto:")) {
            return "lucide:mail";
        }

        const url = new URL(
            /^[a-z][a-z\d+.-]*:/i.test(href)
                ? href
                : `https://${href}`
        );

        const hostname = url.hostname
            .toLowerCase()
            .replace(/^www\./, "");

        if (hostname === "linkedin.com") {
            return "fa6-brands:linkedin-in";
        }

        const parts = hostname.split(".");
        const domain =
            parts.length >= 2
                ? parts[parts.length - 2]
                : parts[0];

        return getIconData(icons, domain)
            ? `simple-icons:${domain}`
            : "lucide:globe";
    } catch {
        return "lucide:globe";
    }
};