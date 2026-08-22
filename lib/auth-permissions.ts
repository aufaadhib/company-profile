import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const cmsAccess = createAccessControl(defaultStatements);

export const cmsRoles = {
  admin: cmsAccess.newRole({
    user: ["create", "list", "ban", "get", "update"],
    session: ["list", "revoke", "delete"],
  }),
  editor: cmsAccess.newRole({ user: [], session: [] }),
};

export type CmsRole = keyof typeof cmsRoles;
