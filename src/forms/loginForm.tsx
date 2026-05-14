import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Use any email with password 'password123'");
    } finally {
      setLoading(false);
    }
  };
  
  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword("password123");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">INFO</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">INFORMATICS</h1>
          <p className="text-gray-600 mt-2">Sales Performance Management System</p>
       
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        </Card>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Access:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => quickLogin("john.northgate@informatics.com")}
            >
              Salesperson
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => quickLogin("manager.manila@informatics.com")}
            >
              Manager
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => quickLogin("execom@informatics.com")}
            >
              Execom
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => quickLogin("admin@informatics.com")}
            >
              Admin
            </Button>
          </div>
          {/* <p className="text-xs text-gray-400 text-center mt-4">
            Use any email + password: password123
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;