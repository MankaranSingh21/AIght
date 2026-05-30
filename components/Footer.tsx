'use client';

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { STATS } from "@/lib/stats";

const NAV_LINKS = [
  { href: "/",              label: "Home"                    },
  { href: "/tools",         label: "Tools"                   },
  { href: "/learn",         label: "Learn"                   },
  { href: "/learn/paths",   label: "Fields"                  },
  { href: "/workflows",     label: "Workflows"               },
  { href: "/use-cases",     label: "Use Cases"               },
  { href: "/signal",        label: "Signal Archive"          },
  { href: "/human",         label: "What AI Cannot Do"       },
  { href: "/about",         label: "About AIght"             },
  { href: "/about/score",   label: "The AIght Score"         },
  { href: "/changelog",     label: "Changelog"               },
  { href: "/support",       label: "Contact / Support"       },
  { href: "/privacy",       label: "Privacy Policy"          },
  { href: "https://github.com/MankaranSingh21/AIght", label: "GitHub" },
];

const FOOTER_STATS = [
  { stat: `${STATS.tools}+`,               label: "curated tools"         },
  { stat: "100%",                          label: "no sponsored rankings"  },
  { stat: String(STATS.affiliateLinks),    label: "affiliate links"        },
];

export default function Footer() {
  return (
    <footer
      className="footer-rule"
      style={{
        borderTop: '1px solid rgba(245,239,224,0.10)',
        background: 'rgba(255,250,240,0.02)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) clamp(20px, 5vw, 48px) 40px' }}>

        {/* Stats strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          marginBottom: 40,
          paddingBottom: 40,
          borderBottom: '1px solid rgba(245,239,224,0.06)',
        }}>
          {FOOTER_STATS.map(({ stat, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--accent-primary)',
              }}>{stat}</span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: 'rgba(245,239,224,0.40)',
              }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 3-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>

          {/* Brand */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 10,
              margin: '0 0 10px',
            }}>
              <span style={{ color: 'var(--text-primary)' }}>AI</span>
              <span style={{ color: 'var(--accent-primary)' }}>ght</span>
              <span className="logo-cursor" style={{ color: 'var(--accent-primary)' }}>_</span>
            </p>
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'rgba(245,239,224,0.40)',
              maxWidth: '28ch',
              margin: 0,
            }}>
              A literary magazine covering AI.
              Curated slowly, on purpose.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,224,0.25)',
              marginBottom: 14,
              margin: '0 0 14px',
            }}>
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'rgba(245,239,224,0.45)',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,239,224,0.45)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Newsletter */}
          <div>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,224,0.25)',
              margin: '0 0 14px',
            }}>
              Stay in the signal
            </p>
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'rgba(245,239,224,0.40)',
              margin: '0 0 16px',
            }}>
              New tools, new stacks, and the occasional note from the archive.
              No spam — ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid rgba(245,239,224,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'rgba(245,239,224,0.25)',
            margin: 0,
          }}>
            © {new Date().getFullYear()} AIght. Built by{' '}
            <Link
              href="/author/moon"
              style={{ color: 'rgba(245,239,224,0.40)', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,239,224,0.40)')}
            >
              Moon
            </Link>
          </p>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 12,
            color: 'rgba(245,239,224,0.20)',
            margin: 0,
          }}>
            Built slowly, on purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
