import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={setLightTheme} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>라이트</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={setDarkTheme} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>다크</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={setSystemTheme} className="cursor-pointer">
          <Monitor className="mr-2 h-4 w-4" />
          <span>시스템</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 간단한 토글 버튼 (드롭다운 없이)
export function SimpleThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      title={isDark ? '라이트 모드로 변경' : '다크 모드로 변경'}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 변경</span>
    </Button>
  )
}

