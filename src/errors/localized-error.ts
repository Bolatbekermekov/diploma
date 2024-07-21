interface LocalizedMessages {
  en: string;
  ru: string;
  kz: string;
}

export default class LocalizedError extends Error {
  localizedMessages: LocalizedMessages;
  statusCode: number;
  code?: number;
  keyValue?: Record<string, any>;
  path?: string;

  constructor(localizedMessages: LocalizedMessages, statusCode: number, code?: number, keyValue?: Record<string, any>, path?: string) {
    super(localizedMessages.en);
    this.localizedMessages = localizedMessages;
    this.statusCode = statusCode;
    this.code = code;
    this.keyValue = keyValue;
    this.path = path;
  }
}
