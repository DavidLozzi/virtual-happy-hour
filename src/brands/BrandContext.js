import React, { useContext } from 'react';

export const BrandContext = React.createContext({});

export const useBrandContext = () => useContext(BrandContext);