'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { Check } from '@/components/brand/Check'
import { Link } from '@/i18n/navigation'
import { submitContact, type ContactState } from '@/lib/contact/action'
import { validateContact, type ContactErrors, type ContactFields } from '@/lib/contact/validate'

type Props = {
  locale: string
  /** value = readable title (goes into the mail), slug = for ?leistung= preselection. */
  services: { value: string; label: string; slug: string }[]
  preselect?: string | null
  phone: { display: string; href: string } | null
}

const EMPTY: ContactFields = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  region: '',
  budget: '',
  message: '',
}

const inputBase =
  'block min-h-[52px] w-full rounded-[3px] bg-white px-3.5 py-3 text-[17px] text-ink outline-none focus:border-ink focus:shadow-[0_0_0_3px_var(--color-accent)]'

/**
 * Contact form (design: Kontakt.dc.html). Errors appear after the first submit
 * and then update live. The server validates again — the client check is only
 * for comfort. No consent checkbox: a privacy note with link sits under the form.
 */
export function ContactForm({ locale, services, preselect, phone }: Props) {
  const t = useTranslations('ContactForm')
  const [formKey, setFormKey] = useState(0)
  return (
    <FormInner
      key={formKey}
      t={t}
      locale={locale}
      services={services}
      preselect={preselect}
      phone={phone}
      onReset={() => setFormKey((k) => k + 1)}
    />
  )
}

function FormInner({
  t,
  locale,
  services,
  preselect,
  phone,
  onReset,
}: Props & { t: ReturnType<typeof useTranslations<'ContactForm'>>; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })
  const [fields, setFields] = useState<ContactFields>(() => ({
    ...EMPTY,
    service: services.find((s) => s.slug === preselect)?.value ?? '',
  }))
  const [tried, setTried] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  const clientErrors: ContactErrors = tried ? validateContact(fields) : {}
  const serverErrors: ContactErrors = state.status === 'invalid' ? state.errors : {}
  const errors: ContactErrors = tried ? clientErrors : serverErrors
  const errorCount = Object.keys(errors).length

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-[4px] border-2 border-ink p-7">
        <p className="flex items-center gap-3 text-2xl font-extrabold text-ink">
          <Check size={28} checked />
          {t('successTitle')}
        </p>
        <p className="mt-3 text-lg">
          {t('successText')}
          {phone && (
            <>
              {' '}
              {t('successCall')} <a href={phone.href}>{phone.display}</a>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 cursor-pointer text-base font-bold underline decoration-accent decoration-2 underline-offset-[3px]"
        >
          {t('again')}
        </button>
      </div>
    )
  }

  const set = (key: keyof ContactFields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setTried(true)
    if (Object.keys(validateContact(fields)).length > 0) {
      e.preventDefault()
      requestAnimationFrame(() => summaryRef.current?.focus())
    }
  }

  const id = (name: string) => `${uid}-${name}`
  const err = (name: keyof ContactFields) => errors[name]
  const border = (name: keyof ContactFields) => (err(name) ? 'border-2 border-error' : 'border border-muted')
  const describedBy = (name: keyof ContactFields) => (err(name) ? `${id(name)}-err` : undefined)

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate aria-label={t('formLabel')} className="grid gap-[22px]">
      <input type="hidden" name="locale" value={locale} />

      {errorCount > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[4px] border-2 border-error px-4 py-3.5 text-base font-bold text-error"
        >
          {t('errSummary', { count: errorCount })}
        </div>
      )}
      {state.status === 'error' && (
        <div role="alert" className="rounded-[4px] border-2 border-error px-4 py-3.5 text-base font-bold text-error">
          {t(state.reason === 'rate' ? 'errRate' : 'errSend')}
          {phone && (
            <>
              {' '}
              <a href={phone.href} className="text-error">
                {phone.display}
              </a>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
        <Field id={id('name')} label={t('name')} error={err('name') && t(err('name')!)}>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={set('name')}
            aria-invalid={Boolean(err('name'))}
            aria-describedby={describedBy('name')}
            className={`${inputBase} ${border('name')}`}
          />
        </Field>
        <Field id={id('company')} label={t('company')} error={err('company') && t(err('company')!)}>
          <input
            id={id('company')}
            name="company"
            type="text"
            autoComplete="organization"
            value={fields.company}
            onChange={set('company')}
            aria-invalid={Boolean(err('company'))}
            aria-describedby={describedBy('company')}
            className={`${inputBase} ${border('company')}`}
          />
        </Field>
        <Field id={id('email')} label={t('email')} error={err('email') && t(err('email')!)}>
          <input
            id={id('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={set('email')}
            aria-invalid={Boolean(err('email'))}
            aria-describedby={describedBy('email')}
            className={`${inputBase} ${border('email')}`}
          />
        </Field>
        <Field id={id('phone')} label={t('phone')} hint={t('optional')}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={set('phone')}
            className={`${inputBase} border border-muted`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[22px]">
        <Field id={id('service')} label={t('service')} error={err('service') && t(err('service')!)}>
          <Select
            id={id('service')}
            name="service"
            value={fields.service}
            onChange={set('service')}
            invalid={Boolean(err('service'))}
            describedBy={describedBy('service')}
            placeholder={t('choose')}
            options={[...services, { value: t('unsure'), label: t('unsure') }]}
          />
        </Field>
        <Field id={id('region')} label={t('region')} error={err('region') && t(err('region')!)}>
          <Select
            id={id('region')}
            name="region"
            value={fields.region}
            onChange={set('region')}
            invalid={Boolean(err('region'))}
            describedBy={describedBy('region')}
            placeholder={t('choose')}
            options={(t.raw('regions') as string[]).map((r) => ({ value: r, label: r }))}
          />
        </Field>
        <Field id={id('budget')} label={t('budget')}>
          <Select
            id={id('budget')}
            name="budget"
            value={fields.budget}
            onChange={set('budget')}
            placeholder={t('choose')}
            options={(t.raw('budgets') as string[]).map((b) => ({ value: b, label: b }))}
          />
        </Field>
      </div>

      <Field id={id('message')} label={t('message')} error={err('message') && t(err('message')!)}>
        <textarea
          id={id('message')}
          name="message"
          rows={6}
          placeholder={t('messagePlaceholder')}
          value={fields.message}
          onChange={set('message')}
          aria-invalid={Boolean(err('message'))}
          aria-describedby={describedBy('message')}
          className={`${inputBase} resize-y leading-[1.55] ${border('message')}`}
        />
      </Field>

      {/* Honeypot: invisible to people, tempting for bots. Filled → silently dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>{t('honeypot')}</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
        <button
          type="submit"
          disabled={pending}
          className="min-h-[52px] cursor-pointer rounded-[3px] bg-accent px-[26px] py-4 text-[17px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? t('sending') : t('submit')}
        </button>
        <span className="text-sm text-muted">{t('required')}</span>
      </div>

      <p className="text-base leading-normal">
        {t.rich('privacy', { link: (chunks: ReactNode) => <Link href="/datenschutz">{chunks}</Link> })}
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string | false | undefined
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-extrabold text-ink">
        {label}
        {hint && <span className="ml-1.5 font-semibold text-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-[15px] font-bold text-error">
          <span aria-hidden="true">✕</span>
          {error}
        </p>
      )}
    </div>
  )
}

function Select({
  id,
  name,
  value,
  onChange,
  invalid = false,
  describedBy,
  placeholder,
  options,
}: {
  id: string
  name: string
  value: string
  onChange: (e: { target: { value: string } }) => void
  invalid?: boolean
  describedBy?: string
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${inputBase} cursor-pointer appearance-none pr-10 ${invalid ? 'border-2 border-error' : 'border border-muted'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
      >
        <path d="M1 4l5 5 5-5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      </svg>
    </div>
  )
}
