declare global {
    interface Window {
        translate?: {
            language: { setLocal: (lang: string) => void };
            service: { use: (engine: string) => void };
            selectLanguageTag: { show: boolean };
            request?: { listener?: { use?: boolean; start?: () => void } };
            listener?: { use?: boolean; start?: () => void };
            execute: () => void;
            changeLanguage: (lang: string) => void;
        };
        __bootPageTranslator?: () => void;
        __pageTranslatorReady?: boolean;
    }
}

function translator() {
    window.__bootPageTranslator?.();
    return window.translate;
}

export function changePageLanguage(langCode: string): void {
    const translate = translator();
    if (!translate) {
        console.warn('Translate.js is not loaded');
        return;
    }
    translate.changeLanguage(langCode);
}

export function refreshPageTranslation(): void {
    const translate = translator();
    if (!translate) {
        return;
    }
    try {
        translate.execute();
    } catch {
        // Ignore translation failures so they cannot blank the UI.
    }
}
