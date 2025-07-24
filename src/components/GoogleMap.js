import React, { useEffect, useRef } from 'react';
import { GOOGLE_MAPS_API_KEY } from '../config';

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const mapScriptUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = mapScriptUrl;
      script.async = true;
      script.onload = () => {
        // eslint-disable-next-line no-undef
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadMapScript();
    } else {
      // eslint-disable-next-line no-undef
      new google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }
  }, []);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default GoogleMap;