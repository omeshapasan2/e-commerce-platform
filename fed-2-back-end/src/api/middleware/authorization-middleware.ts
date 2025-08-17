import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);

    // 1) Try to read role from JWT session claims
    const claimRole =
      (auth.sessionClaims as any)?.metadata?.role ??
      (auth.sessionClaims as any)?.publicMetadata?.role;

    let role = claimRole;

    // 2) If not present in the token, fetch the user to read metadata (public/private)
    if (!role && auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      role =
        (user.publicMetadata as any)?.role ??
        (user.privateMetadata as any)?.role ??
        (user?.unsafeMetadata as any)?.role;
    }

    // 3) Enforce
    if (role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};