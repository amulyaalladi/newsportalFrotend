// src/loaders/authLoader.js
import { getCurrentUser } from "../services/authServices";
import { redirect } from "react-router";

export default async function authLoader() {
  try {
    const user = await getCurrentUser(); //[cite: 5]
    if (!user) {
      return redirect("/login");
    }
    return user;
  } catch (error) {
    // If backend returns 401/404, redirect to login instead of crashing the page
    return redirect("/login");
  }
}