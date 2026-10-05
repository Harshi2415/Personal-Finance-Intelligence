import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function BotpressChat() {
    const location = useLocation();

    useEffect(() => {
        const isAuthPage =
            location.pathname === "/login" ||
            location.pathname === "/register";

        if (isAuthPage) {
            // Hide Botpress on login/register
            const style = document.createElement("style");
            style.id = "hide-botpress";

            style.innerHTML = `
                #bp-web-widget,
                iframe[src*="botpress"],
                [id*="botpress"] {
                    display: none !important;
                }
            `;

            if (!document.getElementById("hide-botpress")) {
                document.head.appendChild(style);
            }

            return;
        }

        // Remove hiding when entering protected pages
        document.getElementById("hide-botpress")?.remove();

        // Load Botpress only once
        if (document.getElementById("botpress-inject")) {
            return;
        }

        const injectScript = document.createElement("script");
        injectScript.id = "botpress-inject";
        injectScript.src =
            "https://cdn.botpress.cloud/webchat/v5.0/inject.js";
        injectScript.async = true;

        const configScript = document.createElement("script");
        configScript.id = "botpress-config";
        configScript.src =
            "https://files.bpcontent.cloud/2026/10/05/04/20261005045940-IR02E13Q.js";
        configScript.async = true;

        document.body.appendChild(injectScript);
        document.body.appendChild(configScript);
    }, [location.pathname]);

    return null;
}

export default BotpressChat;