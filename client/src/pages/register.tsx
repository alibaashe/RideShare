import { RegisterForm } from "@/features/user";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegisterSuccess = () => {
    setLocation("/login");
  };

  const handleSwitchToLogin = () => {
    setLocation("/login");
  };

  return (
    <RegisterForm 
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}