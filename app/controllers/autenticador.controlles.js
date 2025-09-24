import { METHODS } from "http";

 async function login(req, res) {
  res.send("Login exitoso");
}

async function register(req, res) {
  console.log(req.body);
}
export const METHODS = {login, register};