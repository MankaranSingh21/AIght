'use client';

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const NAV_LINKS = [
  { href: "/",        label: "Home"           },
  { href: "/tools",   label: "Tools"          },
  { href: "/learn",   label: "Learn"          },
  { href: "/learn/paths", label: "Fields"     },
  { href: "/signal",  label: "Signal Archive" },
  { href: "/about",   label: "About AIght"    },
  { href: "/submit",  label: "Submit a Tool"  },
  { href: "/support", label: "Contact / Support"},
  { href: "/privacy", label: "Privacy Policy" },
  { href: "https://github.com/MankaranSingh21/AIght", label: "GitHub" },
  { href: "https://ko-fi.com/aightai", label: "Support the Project (Ko-fi)" },
];

const STATS = [
  { stat: "52+",   label: "curated tools"         },
  { stat: "100%",  label: "no sponsored rankings"  },
  { stat: "0",     label: "affiliate links"        },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(245,239,224,0.06)',
      background: 'rgba(255,250,240,0.02)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 48px 40px' }}>

        {/* Stats strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          marginBottom: 40,
          paddingBottom: 40,
          borderBottom: '1px solid rgba(245,239,224,0.06)',
        }}>
          {STATS.map(({ stat, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700,
                color: '#AAFF4D',
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
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 10,
              margin: '0 0 10px',
            }}>
              <span style={{ color: '#F5EFE0' }}>AI</span>
              <span style={{ color: '#AAFF4D' }}>ght</span>
              <span className="logo-cursor" style={{ fontFamily: 'var(--font-mono)', color: '#AAFF4D' }}>_</span>
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
          <nav>
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
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5EFE0')}
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
            <a
              href="mailto:singhmankaran05@gmail.com"
              style={{ color: 'rgba(245,239,224,0.40)', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F5EFE0')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,239,224,0.40)')}
            >
              Mankaran Singh
            </a>
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
