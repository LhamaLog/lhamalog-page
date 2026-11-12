import { ApiError } from "../../shared/services/api";
// ApiError com o código de negócio do Core (ex.: JA_TEM_PLANO_PAGO, TESTE_JA_USADO).
export class SubscriptionError extends ApiError {
  code;
  constructor(message, status, fieldErrors = {}, code) {
    super(message, status, fieldErrors);
    this.code = code;
  }
}
