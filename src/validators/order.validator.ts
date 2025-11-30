/**
 * Validação simples do payload recebido na criação/atualização.
 * Retorna { valid: boolean, message?: string }
 */
export function validateCreatePayload(body: any): {
  valid: boolean;
  message?: string;
} {
  if (!body) return { valid: false, message: "Body é obrigatório" };
  if (!body.numeroPedido || typeof body.numeroPedido !== "string") {
    return {
      valid: false,
      message: "numeroPedido é obrigatório e deve ser string",
    };
  }
  if (typeof body.valorTotal !== "number") {
    return {
      valid: false,
      message: "valorTotal é obrigatório e deve ser number",
    };
  }
  if (!body.dataCriacao)
    return { valid: false, message: "dataCriacao é obrigatória" };
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return {
      valid: false,
      message: "items é obrigatório e deve ser array não vazio",
    };
  }
  for (const it of body.items) {
    if (!it.idItem)
      return { valid: false, message: "idItem é obrigatório em cada item" };
    if (typeof it.quantidadeItem !== "number")
      return { valid: false, message: "quantidadeItem deve ser number" };
    if (typeof it.valorItem !== "number")
      return { valid: false, message: "valorItem deve ser number" };
  }
  return { valid: true };
}
