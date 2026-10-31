import protectedRouteDocs from "../../middlewares/authentication/docs";
import docs from "../../utils/lychee";

export const authDocs = docs.middleware("/auth", {});
export const protectedAuthDocs = protectedRouteDocs.middleware("/auth", {});
