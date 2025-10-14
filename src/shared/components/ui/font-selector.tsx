
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Type, X, Check } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { FONT_FAMILIES, ELEMENT_TYPES } from '@/shared/utils/uiConstantsService';

export const FontSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
    const [appliedFonts, setAppliedFonts] = useState<{ [key: string]: string }>({});

    const applyFonts = () => {
        if (selectedElements.length === 0 || selectedFonts.length === 0) return;

        selectedElements.forEach(elementName => {
            selectedFonts.forEach((fontName, index) => {
                const elementType = ELEMENT_TYPES.find(e => e.name === elementName);
                const font = FONT_FAMILIES.find(f => f.name === fontName);

                if (elementType && font) {
                    const elements = document.querySelectorAll(elementType.selector);
                    elements.forEach(element => {
                        const htmlElement = element as HTMLElement;
                        // Remove existing font classes
                        htmlElement.className = htmlElement.className.replace(/font-[\w-]+/g, '');
                        // Add new font class
                        htmlElement.classList.add(font.class);

                        // Also add CSS custom property for more reliable font application
                        htmlElement.style.fontFamily = getFontFamily(font.name);
                    });

                    // Store preference in localStorage with multiple fonts
                    const storageKey = `font-${elementName}`;
                    const existingFonts = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    const updatedFonts = [...new Set([...existingFonts, fontName])];
                    localStorage.setItem(storageKey, JSON.stringify(updatedFonts));

                    // Update applied fonts state
                    setAppliedFonts(prev => ({
                        ...prev,
                        [elementName]: updatedFonts.join(', ')
                    }));
                }
            });
        });

        // Clear selections after applying
        setSelectedElements([]);
        setSelectedFonts([]);
    };

    const getFontFamily = (fontName: string) => {
        switch (fontName) {
            case 'Inter': return 'Inter, sans-serif';
            case 'Nunito': return 'Nunito, sans-serif';
            case 'Raleway': return 'Raleway, sans-serif';
            case 'Open Sans': return 'Open Sans, sans-serif';
            case 'Lato': return 'Lato, sans-serif';
            case 'PT Sans': return 'PT Sans, sans-serif';
            case 'Bebas Neue': return 'Bebas Neue, cursive';
            case 'Playfair Display': return 'Playfair Display, serif';
            case 'Georgia': return 'Georgia, serif';
            case 'Times New Roman': return 'Times New Roman, serif';
            default: return 'Inter, sans-serif';
        }
    };

    const resetFonts = () => {
        ELEMENT_TYPES.forEach(elementType => {
            localStorage.removeItem(`font-${elementType.name}`);
            const elements = document.querySelectorAll(elementType.selector);
            elements.forEach(element => {
                const htmlElement = element as HTMLElement;
                htmlElement.className = htmlElement.className.replace(/font-[\w-]+/g, '');
                htmlElement.style.removeProperty('font-family');
            });
        });
        setAppliedFonts({});
    };

    const toggleElement = (elementName: string) => {
        setSelectedElements(prev =>
            prev.includes(elementName)
                ? prev.filter(e => e !== elementName)
                : [...prev, elementName]
        );
    };

    const toggleFont = (fontName: string) => {
        setSelectedFonts(prev =>
            prev.includes(fontName)
                ? prev.filter(f => f !== fontName)
                : [...prev, fontName]
        );
    };

    // Load saved preferences on mount
    useEffect(() => {
        const loadedFonts: { [key: string]: string } = {};

        ELEMENT_TYPES.forEach(elementType => {
            const savedFonts = JSON.parse(localStorage.getItem(`font-${elementType.name}`) || '[]');
            if (savedFonts.length > 0) {
                loadedFonts[elementType.name] = savedFonts.join(', ');

                savedFonts.forEach((fontName: string) => {
                    const font = FONT_FAMILIES.find(f => f.name === fontName);
                    if (font) {
                        const elements = document.querySelectorAll(elementType.selector);
                        elements.forEach(element => {
                            const htmlElement = element as HTMLElement;
                            htmlElement.classList.add(font.class);
                            htmlElement.style.fontFamily = getFontFamily(font.name);
                        });
                    }
                });
            }
        });

        setAppliedFonts(loadedFonts);
    }, []);

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-community-md"
                size="icon"
            >
                <Type className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-96">
            <Card className="shadow-2xl border-2 bg-surface">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-nunito">Advanced Font Selector</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-foreground-muted font-raleway mb-2 block">
                            Select Elements (Multiple)
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {ELEMENT_TYPES.map((element) => (
                                <Button
                                    key={element.name}
                                    variant={selectedElements.includes(element.name) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleElement(element.name)}
                                    className="justify-start text-xs h-8"
                                >
                                    {selectedElements.includes(element.name) && <Check className="h-3 w-3 mr-1" />}
                                    {element.name}
                                </Button>
                            ))}
                        </div>
                        {selectedElements.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {selectedElements.map(element => (
                                    <Badge key={element} variant="secondary" className="text-xs">
                                        {element}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground-muted font-raleway mb-2 block">
                            Select Fonts (Multiple)
                        </label>
                        <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                            {FONT_FAMILIES.map((font) => (
                                <Button
                                    key={font.name}
                                    variant={selectedFonts.includes(font.name) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleFont(font.name)}
                                    className="justify-start text-xs h-8"
                                >
                                    {selectedFonts.includes(font.name) && <Check className="h-3 w-3 mr-1" />}
                                    <span className={font.class}>
                                        {font.name} - {font.category}
                                    </span>
                                </Button>
                            ))}
                        </div>
                        {selectedFonts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {selectedFonts.map(font => (
                                    <Badge key={font} variant="secondary" className="text-xs">
                                        {font}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={applyFonts}
                            disabled={selectedElements.length === 0 || selectedFonts.length === 0}
                            className="flex-1 font-raleway"
                        >
                            Apply Fonts ({selectedElements.length}×{selectedFonts.length})
                        </Button>
                        <Button
                            onClick={resetFonts}
                            variant="outline"
                            className="font-raleway"
                        >
                            Reset All
                        </Button>
                    </div>

                    {Object.keys(appliedFonts).length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-foreground-muted font-raleway mb-2 block">
                                Currently Applied
                            </label>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                {Object.entries(appliedFonts).map(([element, fonts]) => (
                                    <div key={element} className="text-xs bg-surface-elevated rounded p-2">
                                        <span className="font-medium">{element}:</span> {fonts}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-foreground-muted font-inter">
                        Select multiple elements and fonts, then apply. Changes are saved automatically.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
