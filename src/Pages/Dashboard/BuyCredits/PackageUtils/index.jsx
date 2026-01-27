export const getPackageColor = (index) => {
  const colors = ['#667eea', '#f093fb', '#4facfe', '#ffd700'];
  return colors[index % colors.length];
};

export const isPopularPackage = (pkg, index) => index === 1;

export const validatePackage = (pkg) => {
  if (!pkg?.id) {
    console.error('Invalid package:', pkg);
    return false;
  }
  return true;
};

export const buildCheckoutUrl = (pkg) => {
  return `/dashboard/checkout?credits=${pkg.credit_amount || 0}&price=${pkg.price}&package_id=${pkg.id}`;
};