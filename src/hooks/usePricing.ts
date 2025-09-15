import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PricingStructure {
  base_prices: {
    [key: string]: number;
  };
  page_price: number;
  feature_prices: {
    [key: string]: number;
  };
}

export interface AddonConfig {
  [key: string]: {
    name: string;
    description: string;
    price: number;
    duration: string;
  };
}

export const usePricing = () => {
  const [pricingStructure, setPricingStructure] = useState<PricingStructure | null>(null);
  const [addonConfig, setAddonConfig] = useState<AddonConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch pricing structure
      const { data: pricingData, error: pricingError } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'pricing_structure')
        .single();

      if (pricingError) throw pricingError;
      setPricingStructure(pricingData.setting_value as any);

      // Fetch addon configuration
      const { data: addonData, error: addonError } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'project_addons')
        .single();

      if (addonError) throw addonError;
      setAddonConfig(addonData.setting_value as any);

    } catch (err: any) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectPrice = (projectData: any) => {
    if (!pricingStructure) return 0;

    let totalPrice = 0;

    // Base price by project type
    const projectType = projectData.websiteType || 'custom';
    totalPrice += pricingStructure.base_prices[projectType] || pricingStructure.base_prices.custom;

    // Additional pages
    const pagesCount = parseInt(projectData.pages || '1');
    if (pagesCount > 1) {
      totalPrice += (pagesCount - 1) * pricingStructure.page_price;
    }

    // Features
    if (projectData.features && Array.isArray(projectData.features)) {
      projectData.features.forEach((feature: string) => {
        totalPrice += pricingStructure.feature_prices[feature] || 0;
      });
    }

    return totalPrice;
  };

  const getProjectStats = (projectData: any) => {
    const pagesCount = parseInt(projectData.pages || '1');
    const featuresCount = projectData.features ? projectData.features.length : 0;
    
    return {
      pages: pagesCount,
      features: featuresCount,
      startDate: projectData.created_at ? new Date(projectData.created_at).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG'),
      lastUpdate: projectData.updated_at ? new Date(projectData.updated_at).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG'),
      expectedDelivery: projectData.estimatedDays || '15 يوم'
    };
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    pricingStructure,
    addonConfig,
    loading,
    calculateProjectPrice,
    getProjectStats,
    refetch: fetchSettings
  };
};