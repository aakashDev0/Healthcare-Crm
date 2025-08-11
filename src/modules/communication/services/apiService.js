// services/apiService.js

const BASE_URL = "http://localhost:8080/api/";

export const apiPost = async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const contentType = res.headers.get("content-type");
  
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = {};
    }
  
    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong");
    }
  
    return data;
  };
  

export const apiGet = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
