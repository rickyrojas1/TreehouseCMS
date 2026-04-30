"use strict"

module.exports = (plugin) => {
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
