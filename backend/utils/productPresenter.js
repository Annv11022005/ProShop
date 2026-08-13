const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeImages = (image) => {
  if (Array.isArray(image)) return image;
  if (image) return [{ url: image }];
  return undefined;
};

// Xử lý trước khi thêm dữ liệu vào database
export const normalizeProductInput = (body) => {
  const images = normalizeImages(body.image);

  let variants = body.variants;
  if (
    !variants &&
    (body.price !== undefined || body.countInStock !== undefined)
  ) {
    const price = toNumber(body.price);
    variants = [
      {
        color: 'Default',
        size: 'Default',
        sku: `SKU-${Date.now()}`,
        price,
        originalPrice: toNumber(body.originalPrice, price),
        countInStock: toNumber(body.countInStock),
      },
    ];
  }

  if (Array.isArray(variants)) {
    variants = variants.map((variant) => ({
      ...variant,
      images: normalizeImages(variant.images) ?? variant.images,
    }));
  }

  return { ...body, image: images, variants };
};

// Sau khi lấy dữ liệu từ database để xử lý và gửi FE
export const presentProduct = (product) => {
  const source = product.toObject ? product.toObject() : product;
  const images = source.image || [];
  const variants = source.variants || [];

  const normalizedVariants = variants.map((variant) => ({
    ...variant,
    images:
      variant.images && variant.images.length > 0 ? variant.images : images,
  }));

  const prices = normalizedVariants
    .map((variant) => variant.price)
    .filter(Number.isFinite);
  const originalPrices = normalizedVariants
    .map((variant) => variant.originalPrice)
    .filter(Number.isFinite);

  return {
    ...source,
    images,
    image: images[0]?.url || '',
    price: prices.length ? Math.min(...prices) : 0,
    originalPrice: originalPrices.length ? Math.min(...originalPrices) : 0,
    countInStock: normalizedVariants.reduce(
      (total, variant) => total + (Number(variant.countInStock) || 0),
      0,
    ),
  };
};
