import { LocaleContext } from "@/contexts/LocaleProvider";
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react";
import { apiClient } from "../api/apiClient";

export const useAuthRedirect = () => {
    const router = useRouter();
    const {locale} = useContext(LocaleContext);

    useEffect(() => {
        const interceptors = apiClient.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && error.config?._retry) {
                    router.push(`/${locale}/login`);
                } 
                return Promise.reject(error); 
            }
        );
        return () => apiClient.interceptors.response.eject(interceptors);

    }, [router, locale]);
}