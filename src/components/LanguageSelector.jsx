import { Button } from '@/components/ui/button.jsx'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu.jsx'
import { Globe } from 'lucide-react'
import { useLanguageSelector } from '../hooks/useI18n'

export function LanguageSelector() {
  const { currentLanguage, languageOptions, changeLanguage } = useLanguageSelector()

  const currentLangOption = languageOptions.find(option => option.value === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">{currentLangOption?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => changeLanguage(option.value)}
            className={`cursor-pointer ${
              option.value === currentLanguage ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{option.flag}</span>
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

