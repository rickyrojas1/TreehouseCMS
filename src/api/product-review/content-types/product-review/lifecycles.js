'use strict';

const PRODUCT_REVIEW_UID = 'api::product-review.product-review';
const PRODUCT_UID = 'api::product.product';

function toFiniteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toNonEmptySlug(value) {
  if (typeof value !== 'string') return null;
  const slug = value.trim();
  return slug.length > 0 ? slug : null;
}

async function findReviewById(strapi, id) {
  if (!id) return null;
  return strapi.entityService.findOne(PRODUCT_REVIEW_UID, id, {
    fields: ['id', 'productSlug'],
  });
}

async function recomputeProductReviewStatsBySlug(strapi, slugInput) {
  const slug = toNonEmptySlug(slugInput);
  if (!slug) return;

  const products = await strapi.entityService.findMany(PRODUCT_UID, {
    filters: { slug: { $eq: slug } },
    fields: ['id'],
    pagination: { page: 1, pageSize: 1 },
  });

  const product = Array.isArray(products) ? products[0] : null;
  const productId = product?.id;
  if (!productId) return;

  // Raw Knex on Strapi's physical table: column names follow DB snake_case mapping.
  // Verify after Strapi major upgrades if aggregates fail silently.
  const table = strapi.db.connection('product_reviews');
  const aggregate = await table
    .where({
      product_slug: slug,
      review_status: 'approved',
      is_published_to_site: true,
    })
    .count({ count: 'id' })
    .avg({ average: 'rating' })
    .first();

  const reviewCount = Math.max(0, Number(aggregate?.count ?? 0) || 0);
  const averageRaw = toFiniteNumber(aggregate?.average);
  const reviewAverage =
    reviewCount > 0 && averageRaw != null
      ? Math.round(averageRaw * 100) / 100
      : 0;

  await strapi.entityService.update(PRODUCT_UID, productId, {
    data: {
      reviewCount,
      reviewAverage,
    },
  });
}

function collectUniqueSlugs(...candidates) {
  const out = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const slug = toNonEmptySlug(candidate);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

module.exports = {
  async beforeUpdate(event) {
    const id = event?.params?.where?.id;
    if (!id) return;
    const previous = await findReviewById(strapi, id);
    event.state.previousProductSlug = previous?.productSlug ?? null;
  },

  async beforeDelete(event) {
    const id = event?.params?.where?.id;
    if (!id) return;
    const previous = await findReviewById(strapi, id);
    event.state.previousProductSlug = previous?.productSlug ?? null;
  },

  async afterCreate(event) {
    const currentSlug = event?.result?.productSlug;
    const slugs = collectUniqueSlugs(currentSlug);
    await Promise.all(slugs.map((slug) => recomputeProductReviewStatsBySlug(strapi, slug)));
  },

  async afterUpdate(event) {
    const previousSlug = event?.state?.previousProductSlug;
    const currentSlug = event?.result?.productSlug;
    const slugs = collectUniqueSlugs(previousSlug, currentSlug);
    await Promise.all(slugs.map((slug) => recomputeProductReviewStatsBySlug(strapi, slug)));
  },

  async afterDelete(event) {
    const previousSlug = event?.state?.previousProductSlug;
    const slugs = collectUniqueSlugs(previousSlug);
    await Promise.all(slugs.map((slug) => recomputeProductReviewStatsBySlug(strapi, slug)));
  },
};
