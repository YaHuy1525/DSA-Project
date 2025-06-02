import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { api } from "../api";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await api.register(registrationData);
      if (response.success) {
        navigate("/signin", { 
          state: { 
            email: formData.email,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.'
          } 
        });
        setTimeout(() => {
          navigate("/signin", { 
            state: { 
              email: formData.email,
              message: 'Đăng ký thành công! Vui lòng đăng nhập.'
            } 
          });
        }, 1000);
      } else {
        console.error('Registration error:', response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-[390px] flex flex-col items-center px-6 py-12">
        <div className="flex flex-col items-center gap-8 w-full">
          <h1 className="text-2xl font-semibold text-gray-900">Đăng ký</h1>
          
          <Card className="w-full">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    placeholder="Xác nhận mật khẩu"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-dark-teal hover:bg-dark-teal/90 text-white rounded-[50px] h-11"
                >
                  Đăng ký
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="text-dark-teal font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-teal rounded"
                  >
                    Đăng nhập
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