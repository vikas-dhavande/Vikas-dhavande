import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(39,39,42,0.8)] bg-[#000000] text-[#71717A] text-xs">
      <div className="w-full px-4 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] p-0.5 shadow-sm">
                <div className="h-full w-full rounded-full bg-[#000000] flex items-center justify-center">
                  <span className="font-mono text-xs font-black text-white">P</span>
                </div>
              </div>
              <span className="text-base font-bold text-white">Portfolio</span>
            </Link>
            <p className="mt-4 max-w-sm text-xs text-[#A1A1AA] leading-relaxed">
              Crafted for exceptional speed and design fidelity. Designed with modern dark palettes, partial prerendering,
              and glassmorphic components.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
              <span className="text-[11px] text-[#A1A1AA]">All systems operational</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-white transition-colors">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#docs" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-white transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#changelog" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(39,39,42,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#A1A1AA]">
            <a href="#twitter" className="hover:text-white transition-colors">
              Twitter / X
            </a>
            <a href="#github" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#discord" className="hover:text-white transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
