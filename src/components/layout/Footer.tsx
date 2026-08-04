import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/ui/Container'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/locale'
import { getAGB, getWiderruf, hasContent } from '@/lib/queries/getLegalDocs'
import type { SiteSetting } from '@/payload-types'

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-4 text-paper/45">{title}</h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className="link-sweep text-paper/70 transition-colors hover:text-paper">
        {children}
      </Link>
    </li>
  )
}

export async function Footer({ settings, locale }: { settings: SiteSetting; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const tn = await getTranslations({ locale, namespace: 'Nav' })
  const year = new Date().getFullYear()
  const email = settings?.contact?.email

  // Widerruf and AGB are optional: as long as nobody has filled the global, the
  // page 404s — so it must not be linked either.
  const [widerruf, agb] = await Promise.all([getWiderruf(locale), getAGB(locale)])

  return (
    <footer className="stage grain relative overflow-hidden text-paper">
      <Container className="relative grid gap-12 py-16 sm:py-20 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div>
          <div className="font-display text-3xl font-extrabold tracking-tight">
            beau<span className="text-accent">.</span>
          </div>
          <p className="mt-4 max-w-xs leading-relaxed text-paper/65">
            {settings?.tagline ?? t('tagline')}
          </p>
          {settings?.social && settings.social.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-5">
              {settings.social.map((s, i) =>
                s.url ? (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep text-sm text-paper/70 hover:text-paper"
                  >
                    {s.platform}
                  </a>
                ) : null,
              )}
            </div>
          )}
        </div>

        <FooterCol title={t('explore')}>
          <FooterLink href="/marken">{tn('brands')}</FooterLink>
          <FooterLink href="/studio">{tn('studio')}</FooterLink>
          <FooterLink href="/ueber-uns">{tn('about')}</FooterLink>
        </FooterCol>

        <FooterCol title={t('legal')}>
          <FooterLink href="/impressum">{t('impressum')}</FooterLink>
          <FooterLink href="/datenschutz">{t('datenschutz')}</FooterLink>
          {hasContent(widerruf) && (
            <FooterLink href="/widerrufsbelehrung">{widerruf.title || t('widerruf')}</FooterLink>
          )}
          {hasContent(agb) && <FooterLink href="/agb">{agb.title || t('agb')}</FooterLink>}
        </FooterCol>

        <FooterCol title={t('contact')}>
          {email && (
            <li>
              <a
                href={`mailto:${email}`}
                className="link-sweep text-paper/70 transition-colors hover:text-paper"
              >
                {email}
              </a>
            </li>
          )}
          {settings?.contact?.address && (
            <li className="whitespace-pre-line text-sm leading-relaxed text-paper/55">
              {settings.contact.address}
            </li>
          )}
        </FooterCol>
      </Container>

      <Container className="relative flex flex-col items-start justify-between gap-3 border-t border-line-dark py-6 text-sm text-paper/55 sm:flex-row sm:items-center">
        <span>
          © {year} Beau-Marketing. {t('rights')}
        </span>
        <span className="text-paper/35">e-Commerce · SaaS · Apps</span>
      </Container>
    </footer>
  )
}
