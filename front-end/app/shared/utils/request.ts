export interface Request<R> {
    headers?: { [key: string]: string },
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: R,
}

export interface Response<T> {
    statusCode: number
    data?: T,
    error?: {
        message: string
    }
}

export default async function request<R, T>(url: string, options?: Request<R>, responseParse = 'json'): Promise<Response<T>> {
  try {
    let body;

    if (options?.data) {
      if (options.data instanceof ReadableStream) {
        body = options.data;
      }
      else {
        body = options.data instanceof FormData ? options.data : JSON.stringify(options.data);
      }
    }

    let headers;
    if (options) {
      headers = 'headers' in options ? options.headers : { 'Content-Type': 'application/json' };
    }

    const req = {
      headers,
      body,
      method: options?.method || 'GET'
    };

    if (req.method === 'GET') req.body = undefined;

    const response = await fetch(url, req);

    if (!response.ok) {
      let message = response.statusText;

      if (responseParse === 'json') {
        const data = await response.json();
        if (data.sucess !== true) message = data.message;
      }

      return {
        statusCode: response.status,
        error: { message }
      };
    }

    if (response.status === 204) {
      return {
        statusCode: response.status
      };
    }

    let responseData;
    if (responseParse === 'json') {
      responseData = await response.json();
    }

    return {
      statusCode: response.status,
      data: responseData
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      error: {
        message: 'Unknown error occurred'
      }
    };
  }
}
