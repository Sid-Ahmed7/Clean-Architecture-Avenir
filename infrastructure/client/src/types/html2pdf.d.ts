interface Html2Pdf {
    (): Html2Pdf;
    set: (options: object) => Html2Pdf;
    from: (element: HTMLElement) => Html2Pdf;
    save: () => Promise<void>;
    outputPdf: (type: 'blob' | 'datauristring' | 'datauri' | 'dataurlnewwindow') => Promise<Blob | string>;
}

declare global {
    interface Window {
        html2pdf?: Html2Pdf;
    }
}

export {};
