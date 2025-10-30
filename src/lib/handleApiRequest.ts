import { AxiosResponse } from "axios";

type ApiFunction<T> = () => Promise<AxiosResponse<T>>;

export const handleApiRequest = async <T>(fn: ApiFunction<T>): Promise<T> => {
  try {
    const response = await fn();
    return response.data;
  } catch (error: any) {
    console.error(
      "API Error:",
      error?.response?.data?.message || "Something went wrong"
    );

    if (error.response) {
      // Server responded but with an error (4xx, 5xx)
      const { data } = error.response;
      throw data || new Error("An unexpected server error occurred.");
    } else if (error.request) {
      // No response received (e.g. network issue)
      throw new Error("Network error, please try again.");
    } else {
      // Something else (request setup, config, etc.)
      throw new Error(error.message || "Unexpected error occurred.");
    }
  }
};
