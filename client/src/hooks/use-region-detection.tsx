import { useState, useEffect } from 'react';

interface RegionInfo {
  country: string;
  currency: string;
  paymentMethods: string[];
  region: string;
  timezone: string;
  isAfrican: boolean;
  loading: boolean;
}

export function useRegionDetection(): RegionInfo {
  const [regionInfo, setRegionInfo] = useState<RegionInfo>({
    country: 'Kenya',
    currency: 'KES',
    paymentMethods: ['M-Pesa', 'Card'],
    region: 'East Africa',
    timezone: 'Africa/Nairobi',
    isAfrican: true,
    loading: true
  });

  useEffect(() => {
    const detectRegion = async () => {
      try {
        // Simple region detection based on timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isAfrican = timezone.includes('Africa');
        
        let detectedInfo = {
          country: 'Kenya',
          currency: 'KES',
          paymentMethods: ['M-Pesa', 'Card'],
          region: 'East Africa',
          timezone,
          isAfrican,
          loading: false
        };

        if (timezone.includes('Nigeria')) {
          detectedInfo = {
            ...detectedInfo,
            country: 'Nigeria',
            currency: 'NGN',
            region: 'West Africa',
            paymentMethods: ['Flutterwave', 'Card']
          };
        } else if (timezone.includes('South_Africa')) {
          detectedInfo = {
            ...detectedInfo,
            country: 'South Africa',
            currency: 'ZAR',
            region: 'Southern Africa',
            paymentMethods: ['Card', 'Mobile Money']
          };
        }

        setRegionInfo(detectedInfo);
        console.log('Region detection:', Date.now() - performance.now() + 'ms');
      } catch (error) {
        console.error('Region detection failed:', error);
        setRegionInfo(prev => ({ ...prev, loading: false }));
      }
    };

    detectRegion();
  }, []);

  return regionInfo;
}