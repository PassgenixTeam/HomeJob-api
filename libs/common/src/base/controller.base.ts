export class CustomError {
  constructor(private errorEnum: any) {}

  messageCode(error: any) {
    let message = error.message;

    const errorCode = Number(error.message);

    if (errorCode) {
      message = this.getErrorMessage(errorCode);
    }

    return {
      errorCode: errorCode,
      message,
    };
  }

  private getErrorMessage(code: number) {
    const indexOfS = Object.values(this.errorEnum).indexOf(
      code as unknown as typeof this.errorEnum,
    );

    const message = Object.keys(this.errorEnum)[indexOfS];

    return message ? message.replace(/([A-Z])/g, ' $1').trim() : `${code}`;
  }
}
