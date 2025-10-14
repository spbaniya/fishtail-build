import { useEffect } from "react";

export function useAntiDevTools({
    action = "close", // "close" | "redirect" | "blank" | "callback"
    redirectUrl = "/blocked",
    callback = () => { }
} = {}) {
    useEffect(() => {
        // Skip anti-devtools functionality if we're already on the redirect URL
        if (window.location.pathname === redirectUrl) {
            return;
        }

        let checkInterval: ReturnType<typeof setInterval> | undefined;

        // --- Kill switch ---
        const triggerBlock = () => {
            if (action === "close") {
                // Many browsers won't allow scripts to close tabs/windows
                // that weren't opened by script. Try several strategies and
                // fall back to a safe redirect/blanking of the document.
                try {
                    // best-effort: normal close
                    window.close?.();

                    // some browsers allow closing after opening the same
                    // window with target _self — try that as a hacky fallback
                    const selfWin = window.open?.('', '_self');
                    selfWin?.close?.();
                } catch (err) {
                    // ignore
                }

                // final fallback: navigate away and blank the DOM so content
                // is effectively removed even if the tab remains open.
                setTimeout(() => {
                    try {
                        if (redirectUrl) {
                            window.location.replace(redirectUrl);
                        } else {

                        }
                    } catch (e) {
                        // If replace fails, wipe the document as last resort
                        document.documentElement.innerHTML = '';
                    }
                }, 100);
            } else if (action === "redirect") {
                window.location.href = redirectUrl;
            } else if (action === "blank") {
                window.location.href = "about:blank";
            } else if (action === "callback") {
                callback();
            }
        };

        // --- 1. Dimension check (docked DevTools detection) ---
        const checkDimensions = () => {
            if (
                window.outerWidth - window.innerWidth > 200 ||
                window.outerHeight - window.innerHeight > 200
            ) {
                triggerBlock();
            }
        };

        // --- 2. Debugger trap (execution pause detection) ---
        const checkDebugger = () => {
            const start = performance.now();
            debugger; // if DevTools open, code pauses here
            if (performance.now() - start > 100) {
                triggerBlock();
            }
        };

        // --- 3. Undocked DevTools detection (safer console trick) ---
        const checkUndocked = () => {
            const threshold = 160;
            if (
                window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold
            ) {
                triggerBlock();
            }
        };

        // --- 4. Shortcut blocking ---
        const keyHandler = (e: KeyboardEvent) => {
            if (e.key === "F12") {
                e.preventDefault();
                triggerBlock();
            }
            if (
                (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
                (e.metaKey && e.altKey && e.key.toLowerCase() === "i")
            ) {
                e.preventDefault();
                triggerBlock();
            }
            if (
                (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") ||
                (e.metaKey && e.altKey && e.key.toLowerCase() === "j")
            ) {
                e.preventDefault();
                triggerBlock();
            }
            if (e.ctrlKey && e.key.toLowerCase() === "u") {
                e.preventDefault();
                triggerBlock();
            }
        };

        // --- Setup ---
        document.addEventListener("keydown", keyHandler);
        checkInterval = setInterval(() => {
            checkDimensions();
            checkDebugger();
            checkUndocked();
        }, 100);

        // --- Cleanup ---
        return () => {
            if (checkInterval !== undefined) {
                clearInterval(checkInterval);
            }
            document.removeEventListener("keydown", keyHandler);
        };
    }, [action, redirectUrl, callback]);
}
