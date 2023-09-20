import { createContext, useContext } from "react";
import { Organization, User } from "../utils/interfaces";

export const SessionContext = createContext<
  | [
      session: {
        user: User;
        organization: Organization;
      },
      _: any
    ]
  | null
>(null);
