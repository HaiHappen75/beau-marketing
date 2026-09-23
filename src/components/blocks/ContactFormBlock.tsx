import { getTranslations } from 'next-intl/server'

import { ContactForm } from '@/components/contact/ContactForm'
import { MediaImage } from '@/components/site/MediaImage'
import { Wrap } from '@/components/site/primitives'
import { withEmphasis } from '@/lib/emphasis'
import { getPayloadClient } from '@/lib/getPayload'
import { telHref } from '@/lib/phone'
import { toPayloadLocale } from '@/lib/locale'

import type { BlockContext, BlockOf } from './types'

/** Contact page: heading, form and the direct-contact column (design: Kontakt.dc.html). */
export async function ContactFormBlock({ block, ctx }: { block: BlockOf<'contactForm'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'ContactForm' })
  const ts = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const c = ctx.settings.company ?? {}
  const phoneHref = telHref(c.phone)
  const phone = phoneHref && c.phone ? { display: c.phone, href: phoneHref } : null

  const payload = await getPayloadClient()
  const { docs: authors } = await payload.find({
    collection: 'authors',
    where: { slug: { equals: 'stephan-beau' } },
    locale: toPayloadLocale(ctx.locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
    limit: 1,
  })
  const person = authors[0]

  return (
    <section className="bg-white pt-[clamp(32px,6vw,80px)] pb-[clamp(56px,8vw,104px)]">
      <Wrap>
        <h1 className="text-[clamp(34px,4.6vw,58px)] leading-[1.05] font-extrabold tracking-[-0.025em]">
          {withEmphasis(block.heading)}
        </h1>
        {block.intro && <p className="mt-3.5 max-w-[34em] text-[clamp(18px,1.5vw,20px)]">{block.intro}</p>}
        {/* wrap-reverse: on mobile the direct-contact column sits above the form. */}
        <div className="mt-[clamp(28px,4vw,48px)] flex flex-wrap-reverse items-start gap-x-20 gap-y-12">
          <div className="max-w-[720px] flex-[2_1_520px]">
            <ContactForm
              locale={ctx.locale}
              services={ctx.services.map((s) => ({ value: s.title, label: s.title, slug: s.slug ?? '' }))}
              preselect={ctx.preselectService}
              phone={phone}
            />
          </div>
          <aside aria-label={t('directContact')} className="grid flex-[1_1_280px] gap-[22px]">
            {phone && (
              <div>
                <p className="text-[15px] font-bold text-muted">{ts('phone')}</p>
                <a href={phone.href} className="text-[clamp(28px,3vw,36px)] font-black">
                  {phone.display}
                </a>
              </div>
            )}
            {c.email && (
              <div>
                <p className="text-[15px] font-bold text-muted">{ts('email')}</p>
                <a href={`mailto:${c.email}`} className="text-[clamp(20px,2vw,24px)] font-extrabold break-words">
                  {c.email}
                </a>
              </div>
            )}
            {(c.legalName || c.street) && (
              <address className="border-t border-line pt-[18px] text-[17px] not-italic">
                {[c.legalName, c.street, [c.postalCode, c.city].filter(Boolean).join(' ')]
                  .filter(Boolean)
                  .map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
              </address>
            )}
            {person && (
              <div className="flex items-center gap-3.5 border-t border-line pt-[18px] text-base">
                <div className="w-[60px] flex-none">
                  <MediaImage media={person.photo} ratio="1/1" sizes="60px" className="rounded-full" />
                </div>
                <p>
                  <strong className="block text-ink">{person.name}</strong>
                  <span className="text-muted">{t('personText')}</span>
                </p>
              </div>
            )}
          </aside>
        </div>
      </Wrap>
    </section>
  )
}
