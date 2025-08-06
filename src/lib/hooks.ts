import { IS_MOCK_FETCH } from "./constants";
import { Jar } from "./definitions";

const fetchMock = (): Promise<Jar> =>
  new Promise((resolve) =>
    resolve({
      jarGoal: 1000000,
      jarAmount: 1,
      extJarId: "123456789",
      name: "Mock name",
      description: "Mock description",
    })
  );

export const fetchMainJarInfo = async (
  clientId: string,
  { isMock = IS_MOCK_FETCH } = {}
): Promise<Jar> => {
  try {
    if (isMock) return fetchMock();

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

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) ?? {};

    if (!data) throw new Error("Missing jar ID in server response");

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const fetchWidgetJarInfo = async (
  extJarId: string,
  { isMock = IS_MOCK_FETCH } = {}
): Promise<Omit<Jar, "extJarId">> => {
  try {
    if (isMock) return fetchMock();

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
        `Server returned ${response.status}: ${response.statusText}`
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
