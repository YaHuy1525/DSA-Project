import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { api, UserResponse } from "../api";

export const SignIn = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: UserResponse = await api.login(email, password);
      if (response.success && response.name) {
          localStorage.setItem('userId', response.name);
          navigate("/select-time");
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-[390px] flex flex-col items-center px-6 py-12">
        <div className="flex flex-col items-center gap-8 w-full">
          <h1 className="text-2xl font-semibold text-gray-900">Đăng nhập</h1>
          
          <Card className="w-full">
            <CardContent className="p-6">
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-dark-teal text-white hover:bg-dark-teal/90 mt-4"
                >
                  Đăng nhập
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Chưa có tài khoản?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-dark-teal font-semibold hover:underline"
                  >
                    Đăng ký
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};