// /app/register/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";

export default function RegisterPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    router.push("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeModal = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeModal}
          onSwitchToRegister={switchToRegister}
          onSuccess={handleAuthSuccess}
        />

        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeModal}
          onSwitchToLogin={switchToLogin}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}
