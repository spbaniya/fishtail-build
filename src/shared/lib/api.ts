/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

export const apiUrl = (url?: string): string => {
    const serverPort = import.meta.env.VITE_SAME_ORIGIN_SOCKET_PORT;
    const { protocol, hostname, port } = window.location;
    const srvPort = serverPort || port;
    return (
        url ||
        import.meta.env.VITE_API_URL ||
        `${protocol}//${hostname}${srvPort ? ':' + srvPort : ''}`
    );
};

export const API_BASE_URL = apiUrl();

export interface IEndpoint<TData = unknown, TResponse = unknown, TExtracted = unknown> {
    url: string;
    method?: HttpMethod;
    data?: TData;
    dataKey?: string;
    headers?: Record<string, string>;
    withAuth?: boolean;
}

interface ApiResponse<TResponse> {
    data: TResponse;
    success: boolean;
    message?: string;
    additional?: string | Record<string, unknown>;
    code: number;
}

function extractData<TExtracted>(obj: unknown, key?: string): TExtracted {
    const path = key ?? 'data';
    return path
        .split('.')
        .reduce((acc: unknown, part: string): unknown => {
            if (acc !== null && typeof acc === 'object' && part in acc) {
                return (acc as Record<string, unknown>)[part];
            }
            return undefined;
        }, obj) as TExtracted;
}

function hasError<T>(response: ApiResponse<T>): boolean {
    return !response.success || response.code < 200 || response.code > 399;
}

export async function request<TData, TResponse, TExtracted>(
    endpoint: IEndpoint<TData, TResponse, TExtracted>
): Promise<{ body: TExtracted; headers: Record<string, string> }> {
    const { url, method, data, headers, dataKey, withAuth } = endpoint;
    const httpMethod = (method ?? 'get').toUpperCase();
    let baseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };
    if (withAuth || typeof withAuth === 'undefined') {
        // For httpOnly session_token cookie, it will be automatically included
        // in requests to the same domain. No need to manually add headers.

        // Fall back to localStorage tokens if available (for backward compatibility)
        const tokenType = localStorage.getItem("tokenType");
        if (tokenType === "Session") {
            const token = localStorage.getItem("token");
            const header = localStorage.getItem("header");
            if (token && header) {
                baseHeaders = {
                    ...baseHeaders,
                    [header]: token
                };
            }
        }
    }
    const options: RequestInit = {
        method: httpMethod,
        headers: baseHeaders,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
    };
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const result: ApiResponse<TResponse> = await response.json();
    /*
    if (!result.success && (result.code === 401 || result.code === 403)) {
        localStorage.clear();
        // Redirect to backend login with current URL as redirect
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const dashboardUrl = `${window.location.origin}/#/dashboard`;
        const loginUrl = `${baseUrl}/auth/login?redirect=${encodeURIComponent(dashboardUrl)}`;
        window.location.href = loginUrl;
    }
    */
    if (!response.ok || hasError(result)) {
        const extra =
            result.additional && typeof result.additional === 'string'
                ? ` ${result.additional}`
                : '';
        throw new Error(result.message + extra || 'Request failed');
    }
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });
    const body = extractData<TExtracted>(result, dataKey);
    return { body, headers: responseHeaders };
}

// File upload response interface
export interface FileUploadResponse {
    file_id: number;
    modified_at: string | null;
    file_name: string;
    title: string;
    mime_type: string;
    size: string;
    extension: string;
    url: string;
    row_count: number | null;
    status: string | null;
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export async function uploadFile(
    file: File,
    url: string = '/media/upload',
    fieldName: string = 'file'
): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        body: formData,
    });

    const result: ApiResponse<FileUploadResponse[]> = await response.json();
    if (!response.ok || hasError(result)) {
        throw new Error(result.message || 'File upload failed');
    }

    return result.data[0];
}

export const Api = {
    get: <T>(url: string, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<null, T, T>({ url, method: 'get', ...conf }),
    post: <TData, T>(url: string, data: TData, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<TData, T, T>({ url, method: 'post', data, ...conf }),
    put: <TData, T>(url: string, data: TData, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<TData, T, T>({ url, method: 'put', data, ...conf }),
    patch: <TData, T>(url: string, data: TData, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<TData, T, T>({ url, method: 'patch', data, ...conf }),
    delete: <T>(url: string, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<null, T, T>({ url, method: 'delete', ...conf }),
    head: <T>(url: string, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<null, T, T>({ url, method: 'head', ...conf }),
    options: <T>(url: string, conf: { headers?: Record<string, string>, withAuth?: boolean } = {}) =>
        request<null, T, T>({ url, method: 'options', ...conf }),
};
