interface IParameters {
  [key: string]: string;
}

interface IBody {
  [key: string]: any;
}

export class Network {
  public static get API_URL() {
    const url = process.env.REACT_APP_API_URL;

    if (!url) {
      throw new Error("API_URL is not defined");
    }

    return url;
  }

  public static async get(
    endpoint: string,
    params: IParameters,
    token?: string
  ) {
    const headers = new Headers();

    if (token !== undefined) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const url = new URL(`${this.API_URL}/${endpoint}/`);

    for (const key in params) {
      url.searchParams.set(key, params[key]);
    }

    return await fetch(url.toString(), {
      method: "GET",
      headers,
    });
  }

  public static async post(endpoint: string, body: IBody, token?: string) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    if (token !== undefined) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return await fetch(`${this.API_URL}/${endpoint}/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  }

  public static async patch(endpoint: string, body: IBody, token?: string) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    if (token !== undefined) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return await fetch(`${this.API_URL}/${endpoint}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
  }

  public static async delete(
    endpoint: string,
    params: IParameters,
    token?: string
  ) {
    const headers = new Headers();

    if (token !== undefined) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const url = new URL(`${this.API_URL}/${endpoint}/`);

    for (const key in params) {
      url.searchParams.set(key, params[key]);
    }

    return await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });
  }
}
