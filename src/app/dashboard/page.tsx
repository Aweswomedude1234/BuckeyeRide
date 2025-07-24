'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowUpRight, CalendarPlus, Users, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app, this would come from a database
const nextRide = {
  id: 'ride123',
  title: 'Trip to Downtown Columbus',
  datetime: new Date(new Date().getTime() + 5 * 60000), // 5 minutes from now for testing
  from: 'Ohio Union',
  to: 'Nationwide Arena',
  role: 'Driver',
  passengers: 3,
  distance: 12,
  duration: 20,
  partner: {
    id: 'user456',
    name: 'Alice',
  },
};

export default function Dashboard() {
  const [rideStatus, setRideStatus] = useState<'upcoming' | 'checked-in' | 'completed'>('upcoming');
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckIn = () => {
    setRideStatus('checked-in');
    toast({
      title: 'Checked In!',
      description: `You've successfully checked in for your ride.`,
    });
  };

  const handleCheckOut = () => {
    setRideStatus('completed');
    setReviewOpen(true);
    toast({
      title: 'Ride Complete!',
      description: `You've checked out. Please rate your experience.`,
    });
  };
  
  const handleSendBuddyRequest = () => {
      toast({
          title: 'Buddy Request Sent!',
          description: `Your buddy request to ${nextRide.partner.name} has been sent.`,
      })
  }

  const submitReview = () => {
    console.log({ rating, review }); // In a real app, save this to the database
    setReviewOpen(false);
    setRating(0);
    setReview('');
    toast({
      title: 'Review Submitted',
      description: 'Thank you for your feedback!',
    });
  };

  const renderRideActions = () => {
    if (!isClient) {
      return null;
    }
    const now = new Date().getTime();
    const rideTime = nextRide.datetime.getTime();
    const isRideTimeNear = rideTime - now < 15 * 60000; // 15 minutes window

    if (rideStatus === 'upcoming' && isRideTimeNear) {
      return <Button onClick={handleCheckIn}>Check-In</Button>;
    }
    if (rideStatus === 'checked-in') {
      return <Button onClick={handleCheckOut}>Check-Out</Button>;
    }
    if (rideStatus === 'completed') {
      return (
        <div className="flex gap-2">
            <Button onClick={() => setReviewOpen(true)} variant="outline">
            Leave a Review
            </Button>
            <Button onClick={handleSendBuddyRequest}>
                Send Buddy Request
            </Button>
        </div>
      );
    }
    return (
      <Button variant="link" className="p-0 h-auto" asChild>
        <Link href="#">
            View Ride Details <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, Brutus!</h1>
          <p className="text-muted-foreground">
            Here&apos;s your carpooling overview for the week.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="h-6 w-6" />
                Plan Your Week
              </CardTitle>
              <CardDescription>
                Set up your recurring rides to get matched.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  No upcoming rides scheduled.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/schedule" className="w-full">
                <Button className="w-full">Create a Schedule</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Find Matches
              </CardTitle>
              <CardDescription>
                Discover potential carpool partners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  New matches are waiting for you.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/matches" className="w-full">
                <Button className="w-full" variant="secondary">
                  Browse Matches
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>
                Complete your profile to get better matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold">75%</span>
                <Progress value={75} aria-label="75% complete" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/profile" className="w-full">
                <Button className="w-full" variant="outline">
                  Update Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">
            Your Next Ride
          </h2>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{nextRide.title}</CardTitle>
                  <CardDescription>
                    {isClient ? nextRide.datetime.toLocaleString([], {
                      weekday: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'Loading...'}
                  </CardDescription>
                </div>
                <Badge variant="default">{nextRide.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  From: <span className="font-normal text-muted-foreground">{nextRide.from}</span>
                </div>
                <div className="font-medium">
                  To: <span className="font-normal text-muted-foreground">{nextRide.to}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{nextRide.passengers} Passengers</span>
                </div>
                <span>•</span>
                <span>{nextRide.distance} miles</span>
                <span>•</span>
                <span>~{nextRide.duration} mins</span>
              </div>
            </CardContent>
            <CardFooter>{renderRideActions()}</CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={isReviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate your ride with {nextRide.partner.name}</DialogTitle>
            <DialogDescription>
              Your feedback helps improve the community.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      rating >= star
                        ? 'text-primary fill-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Comment</Label>
              <Textarea
                id="review"
                placeholder="Share your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitReview} disabled={rating === 0}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}