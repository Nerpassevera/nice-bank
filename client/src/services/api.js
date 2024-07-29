import { auth } from '../authentication/auth.js';

async function authCall() {
    
  // call server with token
  if (auth.currentUser) {
    return auth
      .currentUser.getIdToken()
      .then((idToken) => {
        return idToken
      })
      .catch((error) => console.error("Authentication error:", error));
  } else {
    console.warn(
      "There is currently no logged in user. Unable to call Auth Route."
    );
  }
};
export async function writeToDatabase(email, operation) {

  try{
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);
    
    const raw = {
      email: email,
      operation: operation,
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
    };

    const response = await fetch('/save-logs', requestOptions);
    if (!response.ok) {
      throw new Error("Failed to write this operation to the history log")
    };
    const result = await response.text();
    console.log("Operation log saving ... ", result);
  } catch(error) {
    console.error("Error connecting to history logs: ", error);
    throw error;
  }
}



export async function addUserToDatabase(name, email, password, account_number) {

  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

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
      body: raw
    };

    const response = await fetch(`/account/create`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const result = await response.text();
    console.log("New user has added:", result); 
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}


export async function requestUserBalance(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`/account/balance/${email}`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch user balance");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
}

export async function requestRecipient(email) {

  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`/account/users/${email}`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function requestUserData(email) {
  
    try {
      const idToken = await authCall();
      if (!idToken) throw new Error("No ID token available");
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${idToken}`);
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
  
      const response = await fetch(`/account/data/${email}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }


export async function balanceOperation(email, amount) {

  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const raw = JSON.stringify({
      email: email,
      amount: amount,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(`/balance/operations`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error("Error acessing balance operations:", error);
    throw error;
  }
}

export async function requestOperationHistory(email) {
  try {
    const idToken = await authCall();
    if (!idToken) throw new Error("No ID token available");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${idToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`/account/log-history/${email}`, requestOptions);
    if (!response.ok) {
      throw new Error("Unauthorized");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching operation history:", error);
    throw error;
  }
}
