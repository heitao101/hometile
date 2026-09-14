import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { changePageLanguage } from '@/lib/page-translator';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'chinese_simplified', label: '简体中文' },
    { code: 'chinese_traditional', label: '繁體中文' },
    { code: 'english', label: 'English' },
    { code: 'korean', label: '한국어' },
    { code: 'japanese', label: '日本語' },
    { code: 'french', label: 'Français' },
    { code: 'german', label: 'Deutsch' },
    { code: 'spanish', label: 'Español' },
    { code: 'russian', label: 'Русский' },
    { code: 'arabic', label: 'العربية' },
    { code: 'portuguese', label: 'Português' },
    { code: 'italian', label: 'Italiano' },
    { code: 'dutch', label: 'Nederlands' },
    { code: 'thai', label: 'ไทย' },
    { code: 'vietnamese', label: 'Tiếng Việt' },
    { code: 'indonesian', label: 'Bahasa Indonesia' },
    { code: 'hindi', label: 'हिन्दी' },
    { code: 'malay', label: 'Bahasa Melayu' },
];

export function LanguageSelector() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changePageLanguage(lang.code)}
                        className="cursor-pointer"
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
