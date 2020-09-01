import React, { useEffect, useState } from 'react';
import { BrandContext } from './BrandContext';

const BrandWrapper = ({ children }) => {
  const [brand, setBrand] = useState({ title: null });

  useEffect(() => {
    const loadBrand = async () => {
      const theBrand = await import(`./${window.location.hostname}.js`);
      setBrand(theBrand.default);
    }

    loadBrand();
  }, []);

  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  );
}

export default BrandWrapper;
