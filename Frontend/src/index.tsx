import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SelectTime } from "./screens/MainBoard";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/select-time" element={<SelectTime />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);