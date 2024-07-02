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

  fetch("http://localhost:3001/save-logs/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

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

  fetch("http://localhost:3001/account/create", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

export function requestUserBalance(email) {
  console.log("API >> email: ", email, typeof(email));

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  return fetch(`http://localhost:3001/account/balance/${email}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("Я досталь!", result, typeof(result));
      return result;
    })
    .catch((error) => console.error(error));
}

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

    return fetch("http://localhost:3001/balance/operations", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}