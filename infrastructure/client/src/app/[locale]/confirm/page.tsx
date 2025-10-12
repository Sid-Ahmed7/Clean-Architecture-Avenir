
"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/apiClient";


export default function ConfirmPage() {
    const [message, setMessage] = useState("En attente de confirmation..")
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('token');
        if(!token) {
            return
        }

        apiClient.get(`/auth/confirm?token=${token}`).then((res) => {
            if(res.status === 200) {
                setMessage("Confirmation réussie ! Vous allez être redirigé vers la page de login");
                setTimeout(() => router.push("/login"), 3000)
            }
        });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          Confirmation du compte
        </h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}