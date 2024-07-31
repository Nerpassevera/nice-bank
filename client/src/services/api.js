import { auth } from '../authentication/auth.js';

/**
 * Authenticates the current user and returns their ID token.
 * @returns {Promise<string|undefined>} - A promise that resolves to the ID token or undefined if no user is logged in.
 */
async function authCall() {
  if (auth.currentUser) {
    return auth.currentUser.getIdToken().then(idToken => idToken).catch(error => console.error("Authentication error:", error));
  } else {
    console.warn("There is currently no logged-in user. Unable to call Auth Route.");
  }
}

/**
 * Writes an operation log to the database for a given user.
 * @param {string} email - The email of the user.
 * @param {string} operation - The operation description.
 * @returns {Promise<void>} - A promise that resolves when the operation log is written.
 */
export async function writeToDatabase(email, operation) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const raw = { email, operation };
    const requestOptions = { method: "POST", headers: myHeaders, body: JSON.stringify(raw) };

    const response = await fetch('/save-logs', requestOptions);
    if (!response.ok) throw new Error("Failed to write this operation to the history log");

    const result = await response.text();
    console.log("Operation log saving ... ", result);
  } catch (error) {
    console.error("Error connecting to history logs: ", error);
    throw error;
  }
}

/**
 * Adds a new user to the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} account_number - The account number of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is added.
 */
export async function addUserToDatabase(name, email, password, account_number) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const raw = JSON.stringify({ name, email, password, balance: 0, photo: "client/src/no-user-image-icon.webp", account_number });
    const requestOptions = { method: "POST", headers: myHeaders, body: raw };

    const response = await fetch(`/account/create`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const result = await response.text();
    console.log("New user has added:", result);
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Requests the balance of a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<number>} - A promise that resolves to the user's balance.
 */
export async function requestUserBalance(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = { method: "GET", headers: myHeaders };

    const response = await fetch(`/account/balance/${email}`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch user balance");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
}

/**
 * Requests the recipient's information.
 * @param {string} email - The email of the recipient.
 * @returns {Promise<boolean>} - A promise that resolves to true if the recipient exists, false otherwise.
 */
export async function requestRecipient(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = { method: "GET", headers: myHeaders };

    const response = await fetch(`/account/users/${email}`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Requests the data of a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - A promise that resolves to the user's data.
 */
export async function requestUserData(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = { method: "GET", headers: myHeaders };

    const response = await fetch(`/account/data/${email}`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Performs a balance operation for a user.
 * @param {string} email - The email of the user.
 * @param {number} amount - The amount to be operated on the balance.
 * @returns {Promise<string>} - A promise that resolves to the operation result.
 */
export async function balanceOperation(email, amount) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const raw = JSON.stringify({ email, amount });
    const requestOptions = { method: "POST", headers: myHeaders, body: raw };

    const response = await fetch(`/balance/operations`, requestOptions);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const result = await response.text();
    return result;
  } catch (error) {
    console.error("Error accessing balance operations:", error);
    throw error;
  }
}

/**
 * Requests the operation history of a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Array>} - A promise that resolves to the user's operation history.
 */
export async function requestOperationHistory(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = { method: "GET", headers: myHeaders };

    const response = await fetch(`/account/log-history/${email}`, requestOptions);
    if (!response.ok) throw new Error("Unauthorized");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching operation history:", error);
    throw error;
  }
}