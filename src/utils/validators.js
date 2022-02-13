export function validateEmptyAndLength3(value) {
  if (!value) {
    return '*Este capo es obrigatório';
  }

  if (value.length < 3) {
    return '*Este capo deve ter no mínimo 3 caracteres';
  }

  return true;
}

export function validateEmptyAndEmail(value) {
  const isValideEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(value);

  if (!value) {
    return '*Este capo é obrigatório';
  }

  if (!isValideEmail) {
    return '*Este capo deve ser um email válido';
  }

  return true;
}
