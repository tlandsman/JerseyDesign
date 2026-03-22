"use client";

import { ReactNode } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface DesignLightboxProps {
  children: ReactNode;
}

export function DesignLightbox({ children }: DesignLightboxProps) {
  return (
    <PhotoProvider>
      {children}
    </PhotoProvider>
  );
}
