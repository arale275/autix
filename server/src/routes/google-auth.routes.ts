import express, { Request, Response } from "express";
import passport from "../config/passport";
import { generateToken } from "../utils/jwt.util";
import { JWTPayload } from "../types/auth.types";

// הרחב את Request interface
interface AuthenticatedRequest extends Request {
  user?: any;
}

const router = express.Router();

// התחל Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/login?error=no_user`
        );
      }

      // צור JWT payload
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      };

      // צור JWT token
      const token = generateToken(payload);

      // הפנה לפרונטאנד עם הטוקן
      const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
      res.redirect(
        `${clientURL}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            userType: user.user_type,
            avatarUrl: user.avatar_url,
          })
        )}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_error`);
    }
  }
);

export default router;
