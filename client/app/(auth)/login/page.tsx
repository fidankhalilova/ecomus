"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";

export default function LoginPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Already logged in, redirecting...");
      router.push("/");
    }
  }, [router]);

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = () => {
    console.log("Auth success - redirecting...");

    // Check if token is saved before redirecting
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("Token before redirect:", token ? "✅ Saved" : "❌ Not saved");
    console.log("User before redirect:", user ? "✅ Saved" : "❌ Not saved");

    if (!token) {
      console.error("Token not saved! Something went wrong.");
      return;
    }

    // Use window.location for immediate redirect
    window.location.href = "/";
  };

  const closeModal = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="grow flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-black/40 z-10"
          onClick={closeModal}
        ></div>

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
