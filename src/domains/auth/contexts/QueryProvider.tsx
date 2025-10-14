import React, { createContext, useContext, useMemo } from "react";

interface QueryContextType {
    query: Record<string, string | string[]>;
}

const QueryContext = createContext<QueryContextType>({ query: {} });

function extractQueryParams(): Record<string, string | string[]> {
    const fullUrl = window.location.href;
    let queryString = "";

    // Handle hash-based URLs like #/dashboard?token=abc
    const hashIndex = fullUrl.indexOf("#");
    if (hashIndex !== -1) {
        const hashPart = fullUrl.substring(hashIndex + 1);
        const queryIndex = hashPart.indexOf("?");
        if (queryIndex !== -1) {
            queryString = hashPart.substring(queryIndex + 1);
        }
    }

    // Fallback for normal search URLs (?key=value)
    if (!queryString && window.location.search) {
        queryString = window.location.search.substring(1);
    }

    const params = new URLSearchParams(queryString);
    const result: Record<string, string | string[]> = {};

    for (const [key, value] of params.entries()) {
        if (result[key]) {
            result[key] = Array.isArray(result[key])
                ? [...result[key], value]
                : [result[key] as string, value];
        } else {
            result[key] = value;
        }
    }

    return result;
}

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const query = useMemo(() => extractQueryParams(), [window.location.href]);

    return (
        <QueryContext.Provider value={{ query }}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQuery = () => useContext(QueryContext);
