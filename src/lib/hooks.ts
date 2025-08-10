import { IS_MOCK_FETCH } from "./constants";
import { TJar } from "./definitions";

const MOCK = {
  COUNT: 0,
  increment() {
    return this.COUNT++;
  },
  fetch(): Promise<TJar> {
    return new Promise((resolve) => {
      this.increment();

      return resolve({
        jarGoal: 1000000,
        jarAmount: this.COUNT,
        extJarId: "123456789",
        name: "Mock name",
        description: "Mock description",
      });
    });
  },
};

export const fetchMainJarInfo = async (
  clientId: string,
  { isMock = IS_MOCK_FETCH } = {},
): Promise<TJar> => {
  try {
    if (isMock) return MOCK.fetch();

    const payload = {
      c: "hello",
      referer: "",
      Pc: "BGC0CKjnkObxPeqkTxZ3jHFgA+y1GZQMw1Uh7CWFNyZnhAKIi8p17bZPsWpFCEga2ci26Y42qOhqkgHnuI6nZfs=",
      clientId,
    };

    const url = process.env.NEXT_PUBLIC_MAIN_JAR_INFO;
    if (!url) throw new Error("MAIN_JAR_INFO is empty");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) ?? {};

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const fetchWidgetJarInfo = async (
  extJarId: string,
  { isMock = IS_MOCK_FETCH } = {},
): Promise<Omit<TJar, "extJarId">> => {
  try {
    if (isMock) return MOCK.fetch();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const url = process.env.NEXT_PUBLIC_WIDGET_JAR_INFO;
    if (!url) throw new Error("WIDGET_JAR_INFO is empty");

    const response = await fetch(`${url}/${extJarId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}: ${response.statusText}`,
      );
    }

    const json = await response.json();

    return {
      ...json,
      jarAmount: json.amount,
      jarGoal: json.goal,
      name: json.title,
      description: json.description,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
