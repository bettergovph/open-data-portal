import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface CodeBlockProps {
  /** Text shown and copied. */
  code: string
  /** Names the block for screen readers, e.g. "Claude Code command". */
  label: string
}

export const CodeBlock = ({ code, label }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is blocked (e.g. insecure origin); the text stays selectable.
    }
  }

  return (
    <div className="relative bg-paper-2 border border-rule rounded-sm">
      <section
        className="overflow-x-auto py-3 pl-4 pr-14"
        // Scrollable regions must be reachable by keyboard.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard scroll for long commands
        tabIndex={0}
        aria-label={label}
      >
        <pre className="font-mono text-[13px] leading-relaxed text-ink">
          <code>{code}</code>
        </pre>
      </section>
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 inline-flex items-center gap-1 p-1.5 rounded-sm text-neutral-600 hover:text-primary-600 hover:bg-white transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-positive-700" aria-hidden="true" />
        ) : (
          <Copy className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
      <output className="sr-only">{copied ? "Copied to clipboard" : ""}</output>
    </div>
  )
}
