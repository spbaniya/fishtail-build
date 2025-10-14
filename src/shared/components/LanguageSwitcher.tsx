import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

const LanguageSwitcher = () => {
    const { i18n, ready } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const getLanguageDisplayName = (langCode: string) => {
        switch (langCode) {
            case 'en':
                return 'English';
            case 'ne':
                return 'नेपाली';
            default:
                return 'English';
        }
    };

    // Show default language while i18n is loading
    const currentLanguage = i18n.language || 'en';
    const displayValue = ready ? getLanguageDisplayName(currentLanguage) : 'English';

    return (
        <Select value={currentLanguage} defaultValue="en" onValueChange={changeLanguage}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={displayValue}>
                    {displayValue}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ne">नेपाली</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default LanguageSwitcher;
