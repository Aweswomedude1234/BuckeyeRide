'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Firebase config and init
const firebaseConfig = {
  apiKey: "AIzaSyDhz__S3SlxeVYov8YM3rZsFJ2Voza3KtM",
  authDomain: "buckeyeride-8ca52.firebaseapp.com",
  databaseURL: "https://buckeyeride-8ca52-default-rtdb.firebaseio.com",
  projectId: "buckeyeride-8ca52",
  storageBucket: "buckeyeride-8ca52.firebasestorage.app",
  messagingSenderId: "172661990754",
  appId: "1:172661990754:web:c2081794107508a7d2783b",
  measurementId: "G-989RPMBNN6"
};
// Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

declare global {
  interface Window {
    google: any;
  }
}

export default function SchedulePage() {
    const { toast } = useToast();

    const [schedules, setSchedules] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        routeName: '',
        start: '',
        end: '',
        time: '',
        days: [] as string[],
        role: '',
        distance: '',
    });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Refs for Google Places Autocomplete
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    // Load Google Maps script
    useEffect(() => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqrfDOyzWU59_5dz__gHWzlItX4MXDWLg&libraries=places`;
        script.async = true;
        script.onload = () => {
          // nothing needed here
        };
        document.body.appendChild(script);
      }
    }, []);

    // Setup autocomplete when modal is open
    useEffect(() => {
      if (showModal && window.google && startRef.current && endRef.current) {
        const startAutocomplete = new window.google.maps.places.Autocomplete(startRef.current, { types: ['geocode'] });
        startAutocomplete.addListener('place_changed', () => {
          const place = startAutocomplete.getPlace();
          setForm(prev => ({ ...prev, start: place.formatted_address || startRef.current!.value }));
        });
        const endAutocomplete = new window.google.maps.places.Autocomplete(endRef.current, { types: ['geocode'] });
        endAutocomplete.addListener('place_changed', () => {
          const place = endAutocomplete.getPlace();
          setForm(prev => ({ ...prev, end: place.formatted_address || endRef.current!.value }));
        });
      }
    }, [showModal]);

    // Fetch schedules from Firestore on mount
    useEffect(() => {
      const fetchSchedules = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id });
        });
        setSchedules(items);
        setLoading(false);
      };
      fetchSchedules();
    }, []);

    // Calculate distance using Google Maps Distance Matrix API
    const calculateDistance = async (start: string, end: string) => {
      if (!start || !end) return '';
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(start)}&destinations=${encodeURIComponent(end)}&key=AIzaSyDqrfDOyzWU59_5dz__gHWzlItX4MXDWLg`;
      try {
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        const miles = data.rows[0]?.elements[0]?.distance?.text || '';
        return miles;
      } catch {
        return '';
      }
    };

    const openModal = (schedule?: any, idx?: number) => {
        if (schedule) {
            setForm(schedule);
            setEditIndex(idx ?? null);
        } else {
            setForm({ routeName: '', start: '', end: '', time: '', days: [], role: '', distance: '' });
            setEditIndex(null);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm({ routeName: '', start: '', end: '', time: '', days: [], role: '', distance: '' });
        setEditIndex(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (name === 'days' && e.target instanceof HTMLInputElement && type === 'checkbox') {
            const checked = e.target.checked;
            setForm(prev => ({
                ...prev,
                days: checked
                    ? [...prev.days, value]
                    : prev.days.filter(d => d !== value),
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let distance = form.distance;
        if (form.start && form.end) {
          distance = await calculateDistance(form.start, form.end);
        }
        const routeData = { ...form, distance };
        if (editIndex !== null) {
            // Update Firestore
            const id = schedules[editIndex].id;
            await updateDoc(doc(db, "schedules", id), routeData);
            const updated = [...schedules];
            updated[editIndex] = { ...routeData, id };
            setSchedules(updated);
            toast({ title: 'Route updated', description: 'Your route has been updated.' });
        } else {
            // Add to Firestore
            const docRef = await addDoc(collection(db, "schedules"), routeData);
            setSchedules([...schedules, { ...routeData, id: docRef.id }]);
            toast({ title: 'Route added', description: 'Your route has been added.' });
        }
        closeModal();
    };

    const handleEdit = (idx: number) => {
        openModal(schedules[idx], idx);
    };

    const handleDelete = async (idx: number) => {
        const id = schedules[idx].id;
        await deleteDoc(doc(db, "schedules", id));
        setSchedules(schedules.filter((_, i) => i !== idx));
        toast({ title: 'Route deleted', description: 'Your route has been deleted.' });
    };

    return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Weekly Schedule</CardTitle>
          <CardDescription>
            Manage your recurring carpool routes.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1" onClick={() => openModal()}>
          <PlusCircle className="h-4 w-4" />
          Add New Route
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start Location</TableHead>
              <TableHead>End Location</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Distance (mi)</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{schedule.routeName}</TableCell>
                  <TableCell>
                    <Badge variant={schedule.role === 'Driver' ? 'default' : schedule.role === 'Passenger' ? 'secondary' : schedule.role === 'Any' ? 'outline' : 'outline'}>
                        {schedule.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{schedule.start}</TableCell>
                  <TableCell className="font-medium">{schedule.end}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.days.join(', ')}</TableCell>
                  <TableCell>{schedule.distance}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(index)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(index)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No schedules created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {schedules.length > 0 && (
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{schedules.length}</strong> of <strong>{schedules.length}</strong> schedules
          </div>
        </CardFooter>
      )}

      {/* Modal for Add/Edit Route */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Name</label>
                <input
                  name="routeName"
                  value={form.routeName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Location</label>
                <input
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  required
                  ref={startRef}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Enter start location"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Location</label>
                <input
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  required
                  ref={endRef}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Enter end location"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Arrival Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Occurring Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name="days"
                        value={day}
                        checked={form.days.includes(day)}
                        onChange={handleChange}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="Driver">Driver</option>
                  <option value="Passenger">Passenger</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              {form.start && form.end && (
                <div>
                  <label className="block text-sm font-medium mb-1">Distance (mi)</label>
                  <div className="text-sm">{form.distance || 'Calculating...'}</div>
                </div>
              )}
              <div className="flex gap-2 justify-end pt-2">
                <Button type="submit" size="sm">
                  {editIndex !== null ? 'Update' : 'Add'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
