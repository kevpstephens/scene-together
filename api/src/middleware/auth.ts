import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import type { AuthUser } from "../../../shared/src/types";
import { prisma } from "../utils/prisma.js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware to verify Supabase JWT token
 * Extracts token from Authorization header and verifies with Supabase
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get user from database to get their role
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, email: true, role: true },
    });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found in database" });
    }

    // Attach user info to request
    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

/**
 * Middleware to require admin role (ADMIN or SUPER_ADMIN)
 * Must be used after requireAuth middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

/**
 * Middleware to require super admin role
 * Must be used after requireAuth middleware
 */
export function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Super admin access required" });
  }

  next();
}

/**
 * Optional auth middleware - doesn't fail if no token provided
 * Useful for routes that work with or without auth
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // No token, continue without user
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (!error && data.user) {
      // Get user from database to get their role
      const dbUser = await prisma.user.findUnique({
        where: { id: data.user.id },
        select: { id: true, email: true, role: true },
      });

      if (dbUser) {
        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
}
