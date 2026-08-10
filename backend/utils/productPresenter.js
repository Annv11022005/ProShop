const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const normalizeProductInput = (body) => {
  const images = Array.isArray(body.image)
    ? body.image
    : body.image
      ? [{ url: body.image }]
      : undefined;

  let variants = body.variants;
  if (!variants && (body.price !== undefined || body.countInStock !== undefined)) {
    const price = toNumber(body.price);
    variants = [{
      color: 'Default', size: 'Default', sku: `SKU-${Date.now()}`, price,
      originalPrice: toNumber(body.originalPrice, price),
      countInStock: toNumber(body.countInStock),
    }];
  }

  return { ...body, image: images, variants };
};

export const presentProduct = (product) => {
  const source = product.toObject ? product.toObject() : product;
  const images = source.image || [];
  const variants = source.variants || [];
  const prices = variants.map((variant) => variant.price).filter(Number.isFinite);
  const originalPrices = variants.map((variant) => variant.originalPrice).filter(Number.isFinite);

  return {
    ...source,
    images,
    image: images[0]?.url || '',
    price: prices.length ? Math.min(...prices) : 0,
    originalPrice: originalPrices.length ? Math.min(...originalPrices) : 0,
    countInStock: variants.reduce((total, variant) => total + (Number(variant.countInStock) || 0), 0),
  };
};
