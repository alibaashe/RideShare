import { LoginForm } from "@/features/user";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLoginSuccess = () => {
    setLocation("/home");
  };

  const handleSwitchToRegister = () => {
    setLocation("/register");
  };

  return (
    <LoginForm 
      onLoginSuccess={handleLoginSuccess}
      onSwitchToRegister={handleSwitchToRegister}
    />
  );
}