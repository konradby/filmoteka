export class OmdbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OmdbApiError";
  }
}

export class OmdbNotFoundError extends OmdbApiError {
  constructor(message: string) {
    super(message);
    this.name = "OmdbNotFoundError";
  }
}

export class OmdbNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OmdbNetworkError";
  }
}

export class OmdbConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OmdbConfigError";
  }
}
