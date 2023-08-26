export type ErrorMessage = {
  type: CustomErrorType;
  statusCode: number;
  userMessage: string;
  errorMessage: string;
};

export function isErrorMessage(obj: unknown): obj is ErrorMessage {
  if (!obj) {
    return false;
  }
  return (
    typeof obj === "object" &&
    "type" in obj &&
    "statusCode" in obj &&
    "userMessage" in obj &&
    "errorMessage" in obj &&
    (obj.type === "ERROR" || obj.type === "WARNING") &&
    typeof obj.statusCode === "number" &&
    typeof obj.userMessage === "string" &&
    typeof obj.errorMessage === "string"
  );
}

type CustomErrorType = "ERROR" | "WARNING";

export class CustomError extends Error {
  type: CustomErrorType;
  statusCode: number;
  userMessage: string;

  constructor(
    type: CustomErrorType,
    statusCode: number,
    userMessage: string,
    errorMessage: string
  ) {
    super(errorMessage);
    this.name = "CustomError";
    this.type = type;
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}
