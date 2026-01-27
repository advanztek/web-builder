import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPackages } from '../../../../Hooks/credits';
import { validatePackage, buildCheckoutUrl } from '../PackageUtils';

export const useBuyCredits = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const { getPackages, packages, loading } = useGetPackages();

    useEffect(() => {
        getPackages();
    }, [getPackages]);

    const handleCheckout = (pkg) => {
        if (!validatePackage(pkg)) return;

        console.log('Navigating with package:', pkg);
        navigate(buildCheckoutUrl(pkg));
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return {
        packages,
        loading,
        hoveredCard,
        setHoveredCard,
        handleCheckout,
        handleBack,
    };
};