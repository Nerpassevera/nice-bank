export function writeToDatabase(email, operation) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = {
    email: email,
    operation: operation,
  };

  console.log("raw: ", raw);
  console.log("JSON raw: ", JSON.stringify(raw));

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    // redirect: "follow",
  };

  fetch("/save-logs/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

export function addUserToDatabase(name, email, password, account_number) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: name,
    email: email,
    password: password,
    balance: 0,
    photo: "client/src/no-user-image-icon.webp",
    account_number: account_number,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch("/account/create", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

export function requestUserBalance(email) {

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  return fetch(`/account/balance/${email}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));
};

export function balanceOperation(email, amount) {
  const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      amount: amount,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return fetch("/balance/operations", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
};

export function requestOperationHistory(email) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  
  return fetch(`/account/log-history/${email}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}