import { supabase } from "./supabaseClient";

// SIGN UP
export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password });
}

// LOGIN
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// LOGOUT
export async function signOut() {
  return await supabase.auth.signOut();
}

// GET USER
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}