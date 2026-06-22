import type { ComponentProps } from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  data: ComponentProps<typeof LexicalRichText>['data'] | null | undefined
  className?: string
}

export function RichText({ data, className }: Props) {
  if (!data) return null
  return <LexicalRichText data={data} className={`rich ${className ?? ''}`} />
}
