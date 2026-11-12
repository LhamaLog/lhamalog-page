// Erro de chamada à API com o status HTTP e os erros por campo devolvidos pelo servidor.
export class ApiError extends Error {
  status;
  fieldErrors;
  constructor(message, status, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
