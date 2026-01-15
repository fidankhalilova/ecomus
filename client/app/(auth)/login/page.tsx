"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";

export default function LoginPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Close modals first
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);

    // Use router.replace instead of router.push
    router.push("/");

    // Force refresh after navigation
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Simple close function - just close modals without redirect
  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content with backdrop */}
      <div className="grow flex items-center justify-center relative">
        {/* Dark overlay - click to close */}
        <div
          className="absolute inset-0 bg-black/40 z-10"
          onClick={closeModal} // Click overlay to close
        ></div>

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeModal}
          onSwitchToRegister={switchToRegister}
          onSuccess={handleAuthSuccess}
        />

        {/* Register Modal */}
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
