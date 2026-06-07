"use strict"

function getExpectedRefreshSecret() {
  return (
    process.env.STRAPI_SESSION_REFRESH_SECRET ||
    process.env.STRAPI_API ||
    process.env.LOCAL_STRAPI_API
  )
}

function isAuthorizedRefreshRequest(ctx) {
  const expected = getExpectedRefreshSecret()
  if (!expected) return false

  const authHeader = ctx.request.header.authorization
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return false
  }

  return authHeader.slice("Bearer ".length) === expected
}

module.exports = (plugin) => {
  plugin.controllers.auth.refreshSession = async (ctx) => {
    if (!isAuthorizedRefreshRequest(ctx)) {
      return ctx.unauthorized("Invalid refresh credentials.")
    }

    const body = ctx.request.body ?? {}
    const rawUserId = body.userId
    const userId =
      typeof rawUserId === "number"
        ? rawUserId
        : typeof rawUserId === "string"
          ? Number.parseInt(rawUserId.trim(), 10)
          : NaN

    if (!Number.isFinite(userId) || userId <= 0) {
      return ctx.badRequest("A valid userId is required.")
    }

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: userId },
        select: ["id", "blocked"],
      })

    if (!user || user.blocked === true) {
      return ctx.notFound("User not found.")
    }

    const jwt = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id })

    return ctx.send({ jwt })
  }

  plugin.routes["content-api"].routes.unshift({
    method: "POST",
    path: "/auth/refresh-session",
    handler: "auth.refreshSession",
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  })

  const originalRegister = plugin.controllers.auth.register

  plugin.controllers.auth.register = async (ctx) => {
    const body = ctx.request.body ?? {}
    const email =
      typeof body.email === "string" ? body.email.trim() : ""
    const username =
      typeof body.username === "string" ? body.username.trim() : ""

    const fieldErrors = {}

    if (email) {
      const existingEmail = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: { $eqi: email } },
          select: ["id"],
        })
      if (existingEmail) {
        fieldErrors.email = "Email is already in use."
      }
    }

    if (username) {
      const existingUsername = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { username: { $eqi: username } },
          select: ["id"],
        })
      if (existingUsername) {
        fieldErrors.username = "Username is already in use."
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return ctx.badRequest("Validation failed", {
        fieldErrors,
      })
    }

    return originalRegister(ctx)
  }

  return plugin
}
