import { LoginForm } from "@/features/user";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLoginSuccess = () => {
    setLocation("/");
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}