/*===============================================
 * Authentication Middleware
 * ==============================================
 * JWT verification and role-based access control.
 * Uses Supabase for token validation and Prisma for role lookup.
 * Extends Express Request with authenticated user context.
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import type { AuthUser } from "../types/index.js";
import { prisma } from "../utils/prisma.js";

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error(
    "Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_KEY"
  );
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

/**
 * Supabase client with service role key for token verification
 * Service role bypasses RLS and allows full access for admin operations
 */
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ==================== Type Extensions ====================

/**
 * Extend Express Request to include authenticated user
 * Available after requireAuth or optionalAuth middleware
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ==================== Middleware Functions ====================

/**
 * Require valid authentication
 *
 * Verifies JWT token from Authorization header and attaches user to request.
 * Must be applied before routes that require authentication.
 *
 * @example
 * router.get('/protected', requireAuth, handler);
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    // Get user from database with role
    let dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, email: true, role: true },
    });

    // Auto-create user if they exist in Supabase Auth but not in our database
    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            role: "USER",
            name: data.user.user_metadata?.name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
          },
          select: { id: true, email: true, role: true },
        });
        console.log(`✨ Auto-created user: ${dbUser.email}`);
      } catch (createError) {
        console.error("Failed to auto-create user:", createError);
        res.status(401).json({ error: "User not found in database" });
        return;
      }
    }

    // Attach authenticated user to request
    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}

/**
 * Require admin role (ADMIN or SUPER_ADMIN)
 *
 * Must be chained after requireAuth middleware.
 * Grants access to event management and user administration.
 *
 * @example
 * router.post('/events', requireAuth, requireAdmin, handler);
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}

/**
 * Require super admin role
 *
 * Must be chained after requireAuth middleware.
 * Grants full system access for critical operations.
 *
 * @example
 * router.delete('/users/:id', requireAuth, requireSuperAdmin, handler);
 */
export function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "SUPER_ADMIN") {
    res.status(403).json({ error: "Super admin access required" });
    return;
  }

  next();
}

/**
 * Optional authentication
 *
 * Attaches user to request if valid token is provided, but doesn't fail otherwise.
 * Useful for routes that provide enhanced features for authenticated users.
 *
 * @example
 * router.get('/events', optionalAuth, handler); // Public with optional user context
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    // No token provided - continue without user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    // Valid token - attach user to request
    if (!error && data.user) {
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

    // Continue regardless of token validity
    next();
  } catch (error) {
    // Silently continue without user on any error
    next();
  }
}
