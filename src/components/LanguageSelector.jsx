import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = getAvailableLanguages()
  const currentLang = languages.find(lang => lang.code === currentLanguage)

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full right-0 mt-1 z-20 min-w-32 max-w-full">
            <CardContent className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                    currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

