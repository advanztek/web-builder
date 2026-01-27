export const VALID_COUPONS = {
    FIRST15: 15,
    LOYALTY25: 25,
    VIP30: 30,
};

export const validateCoupon = (couponCode) => {
    return VALID_COUPONS[couponCode.toUpperCase()];
};

export const calculateDiscountedTotal = (price, discountPercent) => {
    const originalPrice = parseFloat(price || 0);
    const discountAmount = (originalPrice * discountPercent) / 100;
    return (originalPrice - discountAmount).toFixed(2);
};

export const extractCheckoutParams = (searchParams) => {
    return {
        credits: searchParams.get('credits') || 0,
        price: searchParams.get('price') || 0,
        packageId: searchParams.get('packageId') || searchParams.get('package_id'),
    };
};