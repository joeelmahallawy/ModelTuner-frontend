import { createContext, useContext } from "react";
import { User } from "../utils/interfaces";

export const SessionContext = createContext<
  | [
      session: {
        user: User;
      },
      _: any
    ]
  | null
>(null);
