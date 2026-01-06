"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

interface ExpandableSearchProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
}

export function ExpandableSearch({
    placeholder = "Tìm kiếm...",
    value: controlledValue,
    onChange,
    onSearch,
}: ExpandableSearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [internalValue, setInternalValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const setValue = onChange ?? setInternalValue;

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                !value
            ) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded, value]);

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleClear = () => {
        setValue("");
        if (onSearch) {
            onSearch("");
        }
        setIsExpanded(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
        if (e.key === "Escape") {
            if (value) {
                setValue("");
                if (onSearch) {
                    onSearch("");
                }
            } else {
                setIsExpanded(false);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex items-center transition-all duration-300 ease-in-out",
                isExpanded ? "w-64 sm:w-80" : "w-10"
            )}
        >
            {!isExpanded ? (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleExpand}
                    className="h-10 w-10 rounded-full hover:bg-accent"
                    aria-label="Search"
                >
                    <Search className="h-5 w-5 text-muted-foreground" />
                </Button>
            ) : (
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-10 w-full pl-9 pr-10 transition-all"
                    />
                    {value && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleClear}
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
