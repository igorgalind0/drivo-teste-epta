/** Mínimo de 8 caracteres, com pelo menos uma letra e um número */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

export const PASSWORD_RULE_MESSAGE =
  'A senha deve ter ao menos 8 caracteres, combinando letras e números';