type flag = {
  key: string;
  value: boolean;
};

export type flags = flag[];

export type request = {
  userAgent: string;
  lang: string;
  keys: string[]; // ex. ['showNews', 'showPopup', 'canDoSmth']
};

export type context = {
  userAgent: string;
  lang: string;
};

export interface IFeatureFlagsService {
  fetchFlags(flags: string[]): Promise<flags | null>;
  updateContext(context: context): Promise<flags | null>;
  onError(callback: (error: string) => void): void;
  onFetched(callback: () => void): void;
}

export class FeatureFlagsService implements IFeatureFlagsService {
  private onFetchedCallback: () => void;
  private onErrorCallback: (error: string) => void;
  private context: context;
  private requestedFlags: string[];

  constructor(context?: context) {
    if (!context) {
      context = {
        lang: "eng",
        userAgent: window.navigator.userAgent,
      };
    }
    this.requestedFlags = [];
    this.context = context;
    this.onFetchedCallback = () => {};
    this.onErrorCallback = (error: string) => {};
  }

  onFetched = (callback: () => void) => {
    this.onFetchedCallback = callback;
  };

  onError = (callback: (error: string) => void) => {
    this.onErrorCallback = callback;
  };

  fetchFlags = async (flags: string[]) => {
    const params = new URLSearchParams();
    params.append("userAgent", this.context.userAgent);
    params.append("lang", this.context.lang);

    this.requestedFlags.concat(flags);

    this.requestedFlags.forEach((flag, i) => {
      params.append(`flag${[i]}`, flag);
    });

    const getUserResult = await this.makeQuery(
      `/getFlags?${params.toString()}`
    );

    if (getUserResult.status) {
      this.onFetchedCallback();
      return getUserResult.data;
    }

    this.onErrorCallback(getUserResult.error || "Unknown error");

    return null;
  };

  updateContext = async (context: context) => {
    this.context = context;
    return this.fetchFlags([]);
  };

  private makeQuery = async (url: string) => {
    url = "/api" + url;
    try {
      const result = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();

      if (!result.ok) {
        return {
          status: false,
          data: null,
          error: data.error,
        };
      }

      return {
        status: false,
        data: null,
        error: data.error,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        data: null,
        // @ts-ignore
        error: error.message,
      };
    }
  };
}
