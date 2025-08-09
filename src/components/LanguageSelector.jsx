import { Globe } from 'lucide-react'
import { useLanguageSelector } from '../hooks/useI18n'

/**
 * A simplified language selector that uses a native `<select>` element instead of a
 * dropdown menu. The previous implementation relied on a custom dropdown
 * component which rendered an additional arrow element that overlapped the
 * selected value in dark mode. By using a standard `<select>` wrapped in a
 * container with custom styles, we remove the extra overlay and ensure the
 * selected language and flag are clearly visible in both light and dark
 * themes. See the accompanying CSS in `index.html` for `.lang-wrap` and
 * `.lang-select` definitions, which hide the default arrow and add a
 * custom triangle icon via a pseudo‑element.
 */
export function LanguageSelector() {
  const { currentLanguage, languageOptions, changeLanguage } = useLanguageSelector()

  return (
    <div className="lang-wrap">
      {/* Globe icon indicates language selection; aria-hidden so screen readers skip it */}
      <Globe className="h-4 w-4 mr-1" aria-hidden="true" />
      <select
        className="lang-select"
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label="언어 선택"
      >
        {languageOptions.map(({ value, flag }) => (
          <option key={value} value={value}>
            {flag} {value.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}
