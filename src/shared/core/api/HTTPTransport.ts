const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const;

type Method = keyof typeof METHODS;

type RequestOptions = {
    timeout?: number;
    headers?: Record<string, string>;
    method?: Method;
    data?: Record<string, string> | FormData;
};

function queryStringify(data: Record<string, string>): string {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be an object');
    }

    return (
        '?' +
        Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
    );
}

class HTTPTransport {
    get(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
        return this.request(url, { ...options, method: METHODS.GET });
    }

    post(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
        return this.request(url, { ...options, method: METHODS.POST });
    }

    put(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
        return this.request(url, { ...options, method: METHODS.PUT });
    }

    delete(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
        return this.request(url, { ...options, method: METHODS.DELETE });
    }

    request(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
        const { headers = {}, method, data, timeout = 5000 } = options;

        return new Promise((resolve, reject) => {
            if (!method) {
                reject(new Error('No method provided'));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            xhr.open(method, isGet && data ? `${url}${queryStringify(data as Record<string, string>)}` : url);

            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.onload = () => resolve(xhr);
            xhr.onabort = () => reject(new Error('Request aborted'));
            xhr.onerror = () => reject(new Error('Request error'));
            xhr.ontimeout = () => reject(new Error('Request timed out'));

            xhr.timeout = timeout;

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            }
        });
    }
}

export default HTTPTransport