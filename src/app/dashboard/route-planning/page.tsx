'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map as MapIcon, Pin, Clock } from 'lucide-react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { Skeleton } from '@/components/ui/skeleton';

const libraries: ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[] = ['places'];

export default function RoutePlanningPage() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mapCenter, setMapCenter] = useState({
    lat: 39.9612,
    lng: -82.9988,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleShowRoute = async () => {
    if (!startLocation || !endLocation) return;
    
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance?.text ?? '');
          setDuration(route.duration?.text ?? '');
          if(route.start_location){
            setMapCenter({lat: route.start_location.lat(), lng: route.start_location.lng()});
          }
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  
  if(loadError) return <div>Error loading maps</div>
  if(!isLoaded) return <Skeleton className="h-full min-h-[600px] w-full" />

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1 flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Route</CardTitle>
            <CardDescription>
              Enter start and end points to see your route.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-location">Start Location</Label>
              <PlacesAutocompleteInput
                value={startLocation}
                onChange={setStartLocation}
                placeholder="e.g., Ohio State University"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-location">End Location</Label>
               <PlacesAutocompleteInput
                value={endLocation}
                onChange={setEndLocation}
                placeholder="e.g., John Glenn Columbus Intl Airport"
              />
            </div>
            <Button onClick={handleShowRoute}>Show Route</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Route Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Pin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-lg font-semibold">{distance || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="text-lg font-semibold">{duration || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="h-full min-h-[600px]">
          <CardContent className="h-full p-0 rounded-lg">
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              center={mapCenter}
              zoom={12}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface PlacesAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function PlacesAutocompleteInput({ value, onChange, placeholder }: PlacesAutocompleteInputProps) {
  const {
    ready,
    value: acValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = ({ description }: { description: string }) => {
    setValue(description, false);
    onChange(description);
    clearSuggestions();
  };
  
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
      />
      {status === 'OK' && (
        <div className="absolute z-10 w-full bg-background border rounded-md mt-1">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;
            return (
              <div
                key={place_id}
                onClick={() => handleSelect(suggestion)}
                className="p-2 hover:bg-muted cursor-pointer"
              >
                <strong>{main_text}</strong> <small>{secondary_text}</small>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
