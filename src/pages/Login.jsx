import React from "react";
import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { UtensilsCrossed } from "lucide-react";

export const Login = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-amber-50/40 via-slate-50 to-orange-50/30 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[420px] mx-auto">
        
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                VGI Canteen
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Vishveshwarya Group of Institutions
            </p>
          </div>

          {/* Segmented Options: Log In & Sign Up */}
          <div className="flex bg-slate-100/90 p-1.5 rounded-2xl mb-6 border border-slate-200/60">
            <Link
              to="/login"
              className="flex-1 py-2 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all bg-white text-slate-900 shadow-sm border border-slate-200/50"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-xl transition-all text-slate-500 hover:text-slate-900"
            >
              Sign Up
            </Link>
          </div>

          {/* Clerk SignIn */}
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            fallbackRedirectUrl="/home"
            appearance={{
              layout: {
                unsafe_disableDevelopmentModeWarnings: true
              },
              variables: {
                colorPrimary: "#ea580c",
                colorTextOnPrimaryBackground: "#ffffff",
                borderRadius: "0.875rem",
                colorBackground: "#ffffff",
                colorInputBackground: "#f8fafc",
                colorInputText: "#0f172a"
              },
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none border-none bg-transparent p-0 w-full",
                card: "shadow-none border-none bg-transparent p-0 w-full",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                captcha: "hidden",
                captchaElement: "hidden",
                lastAuthenticationStrategyBadge: "hidden",
                socialButtonsBlockButton: "rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 h-11 sm:h-12 shadow-xs transition-all text-xs sm:text-sm",
                formButtonPrimary: "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold rounded-xl h-11 sm:h-12 shadow-lg shadow-brand-500/25 transition-all text-xs sm:text-sm",
                formFieldInput: "rounded-xl border-slate-200 text-slate-800 text-xs sm:text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 h-10 sm:h-11",
                footer: "hidden",
                footerAction: "hidden",
                dividerLine: "bg-slate-100",
                dividerText: "text-[11px] text-slate-400 font-medium"
              }
            }}
          />
        </div>

      </div>
    </div>
  );
};
