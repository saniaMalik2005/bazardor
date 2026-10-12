
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./bazardor.sqlite"),

  emailAndPassword: {
    enabled: true,
  },
});
