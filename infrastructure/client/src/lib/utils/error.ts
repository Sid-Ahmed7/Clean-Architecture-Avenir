interface AxiosError extends Error {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export function getErrorMessage(error: Error | AxiosError | { message: string },fallbackMessage = "Une erreur est survenue"
): string {
  const axiosError = error as AxiosError;
  if (axiosError.response?.data?.error) {
    return axiosError.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}

