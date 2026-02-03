export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const getStatusBadge = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (!coupon.status) return { text: 'Inactive', color: 'default' };
    if (now < validFrom) return { text: 'Scheduled', color: 'info' };
    if (now > validUntil) return { text: 'Expired', color: 'error' };
    if (coupon.used_count >= coupon.usage_limit) return { text: 'Depleted', color: 'warning' };
    return { text: 'Active', color: 'success' };
};

export const getUsagePercentage = (coupon) => {
    return (coupon.used_count / coupon.usage_limit) * 100;
};

export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
};