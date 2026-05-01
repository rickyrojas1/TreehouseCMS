---
title: Strapi
description: A self-hosted version of Strapi using a Postgres database
tags:
  - strapi
  - postgresql
  - cms
  - javascript
---

# Strapi example

This example deploys self-hosted version of [Strapi](https://strapi.io/). Internally it uses a PostgreSQL database to store the data.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/strapi?referralCode=milo)

## ✨ Features

- Strapi
- Postgres

## 💁‍♀️ How to use

- Click the Railway button 👆
- Add the environment variables
  - If you do not add the Cloudinary related environment variables, your images/files will not be persisted between deploys.

## 📝 Notes

- After your app is deployed, visit the `/admin` endpoint to create your admin user.
- Railway's filesystem is ephemeral which is why any changes to the filesystem are not persisted between deploys. This is why, this example uses Cloudinary for storage.

## Product reviews & user product picks (content types)

This project includes:

- **`product-review`** — ratings, body, optional title/media, reviewer + moderation fields (`reviewStatus`, `isPublishedToSite`, `isPostedToDiscord`, etc.), and product identifiers (`productSlug`, `productDutchieId`, `productPosId`, `productNameSnapshot`).
- **`staff-pick-submission`** (API id unchanged) — **User product picks**: one row per user, linked via the `budtender` relation (owner of the list) + repeatable **`shared.staff-pick-item`** (rank, `dutchieId`, `slug`, optional name/image/brand snapshots).
- **Extended `User`** — `isStaff`, **`showOnStaffPicks`** (when true with `isStaff`, the storefront homepage carousel can include this user's picks), plus relations to reviews and pick submissions.

**Homepage carousel:** the dispensary site queries active submissions where the owner has `isStaff: true` and `showOnStaffPicks: true`.

**Team profile (`/team/[username]`):** the storefront loads the user by username (case-insensitive) via GraphQL `usersPermissionsUsers`, then loads picks and reviews. The **API token role** used for server-side GraphQL must allow **`find`** on **User** (`plugin::users-permissions.user`), or the page falls back to data from an active `staff-pick-submission` only. The account must have **`isStaff: true`** in Strapi unless the storefront sets **`NEXT_PUBLIC_USER_PICKS_PROFILES_PUBLIC=true`**.

**`teamProfileAbout` and GraphQL:** after you add `teamProfileAbout` to the User schema and restart Strapi so GraphQL exposes it, add `teamProfileAbout` back under `budtender.attributes` in `graphql/strapi/fragments/staffPickSubmission.ts` and in `graphql/strapi/queries/GetTeamProfileUserByUsernameQuery.ts` so the team page can show the bio from CMS. Until then, the profile REST API can still store it, but public team pages won’t load it via GraphQL.

**End-user pick lists:** authenticated customers update their own list via the **Next.js storefront** `/api/user-picks` route (server uses the Strapi API token), not by granting open `create`/`update` on `staff-pick-submission` to the Authenticated role (Strapi has no row-level security by default).

**Storefront profile (`/account/profile`):** customers update **username**, name, birth date, **team page bio** (`teamProfileAbout`, shown on `/team/[username]`), and **avatar** via the dispensary app, which calls Strapi REST `PUT /api/users/:id` with the **user’s JWT**. **Email** and **phone** are not changed from the storefront (support handles those). In **Settings → Users & Permissions → Roles → Authenticated → User**, enable **`update`** (and ensure **Upload** allows authenticated uploads for profile photos if needed).

After deploying or running `yarn develop`, Strapi will sync the database schema. In **Settings → Users & Permissions → Roles**, configure **Public** / **Authenticated** (and any custom roles) for `product-review` and `staff-pick-submission` as needed (e.g. authenticated `create` for reviews, restricted `find`/`findOne` for public until approved). GraphQL types are generated when the GraphQL plugin is enabled.
