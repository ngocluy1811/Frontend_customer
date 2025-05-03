import React, { useEffect, useState, useRef, createElement } from 'react';
import { Loader, MapPinIcon, NavigationIcon } from 'lucide-react';
interface ShipperLocationMapProps {
  shipperLocation: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  estimatedTime?: string;
  distance?: string;
}
const ShipperLocationMap = ({
  shipperLocation,
  destination,
  estimatedTime,
  distance
}: ShipperLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Initialize Google Maps
    const initMap = async () => {
      if (!mapRef.current) return;
      const google = (window as any).google;
      if (!google) {
        console.error('Google Maps not loaded');
        return;
      }
      const map = new google.maps.Map(mapRef.current, {
        center: shipperLocation,
        zoom: 14,
        styles: [{
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{
            visibility: 'off'
          }]
        }]
      });
      // Add shipper marker with custom icon
      const shipperMarker = new google.maps.Marker({
        position: shipperLocation,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#f97316',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2
        },
        title: 'Vị trí shipper'
      });
      // Add destination marker
      const destinationMarker = new google.maps.Marker({
        position: destination,
        map,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        },
        title: 'Điểm giao hàng'
      });
      // Draw route between shipper and destination
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#f97316',
          strokeWeight: 4
        }
      });
      const request = {
        origin: shipperLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
      setIsLoading(false);
    };
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [shipperLocation, destination]);
  if (isLoading) {
    return <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin text-orange-500" />
          <span>Đang tải bản đồ...</span>
        </div>
      </div>;
  }
  return <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg overflow-hidden" />
      {/* Overlay with estimated time and distance */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <NavigationIcon className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">
            {estimatedTime || '15-20 phút'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-orange-500" />
          <span className="text-sm">{distance || '2.5 km'}</span>
        </div>
      </div>
    </div>;
};
export default ShipperLocationMap;