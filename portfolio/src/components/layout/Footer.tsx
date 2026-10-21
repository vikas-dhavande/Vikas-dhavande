import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground text-xs transition-colors duration-200">
      <div className="w-full px-4 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] p-0.5 shadow-sm">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                  <span className="font-mono text-xs font-black text-foreground">V</span>
                </div>
              </div>
              <span className="text-base font-bold text-foreground">Vikas</span>
            </Link>
            <p className="mt-4 max-w-sm text-xs text-muted-foreground leading-relaxed">
              Crafted for exceptional speed and design fidelity. Designed with modern theme palettes, partial prerendering,
              and glassmorphic components.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-muted-foreground font-mono">All systems operational</span>
            </div>
          </div>

          {/* Links Column 1: Portfolio */}
          <div>
            <h4 className="font-semibold text-foreground uppercase text-[11px] tracking-wider mb-4">
              Portfolio
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#experience" className="hover:text-foreground transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-foreground transition-colors">
                  Education
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-foreground transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Resources & CV */}
          <div>
            <h4 className="font-semibold text-foreground uppercase text-[11px] tracking-wider mb-4">
              Knowledge
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#resources" className="hover:text-foreground transition-colors">
                  Curated Resources
                </a>
              </li>
              <li>
                <a href="/resume.md" target="_blank" className="hover:text-foreground transition-colors">
                  Resume (Markdown)
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  HIL Simulation Rigs
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-foreground transition-colors">
                  Avionics Subsystems
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Contact */}
          <div>
            <h4 className="font-semibold text-foreground uppercase text-[11px] tracking-wider mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:vikasndhavande@gmail.com" className="hover:text-foreground transition-colors">
                  vikasndhavande@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919731999323" className="hover:text-foreground transition-colors">
                  +91 9731999323
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/80">Bangalore, India</span>
              </li>
              <li>
                <a href="#social" className="text-[#E11D48] hover:underline font-medium">
                  Send Direct Dispatch →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Vikas N Dhavande. All rights reserved.</p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="mailto:vikasndhavande@gmail.com" className="hover:text-foreground transition-colors">
              Email
            </a>
            <a href="#social" className="hover:text-foreground transition-colors">
              Socials
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
