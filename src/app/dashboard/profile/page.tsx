'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, RefreshCw } from 'lucide-react';
import { summarizeReviews } from '@/ai/flows/summarize-reviews';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const userReviews = [
    "Brutus is always on time and a great conversationalist. Highly recommend!",
    "Clean car and a safe driver. The ride was pleasant.",
    "A bit quiet, but very reliable. Gets you from A to B without any fuss.",
    "Great taste in music! The commute flew by.",
    "Sometimes runs a few minutes late, but always communicates it. I appreciate the heads up.",
];

export default function ProfilePage() {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const generateSummary = async () => {
        setIsLoading(true);
        try {
            const result = await summarizeReviews({ reviews: userReviews });
            setSummary(result.summary);
        } catch (error) {
            console.error('Failed to generate summary:', error);
            setSummary('Could not generate a summary at this time. Please ensure your API key is set up correctly.');
            toast({
                title: 'AI Summary Failed',
                description: 'Could not generate a summary. Please check the console for more details.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlaceholderAction = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `This is a placeholder for the "${action}" action.`,
        });
    }

    useEffect(() => {
        generateSummary();
    }, []);


  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="grid md:col-span-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="user avatar" />
                <AvatarFallback>BB</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => handlePlaceholderAction('Change Photo')}>Change Photo</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" defaultValue="Brutus Buckeye" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="brutus@osu.edu" disabled />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="614-123-4567" />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="car-model">Car Model (if driver)</Label>
                <Input id="car-model" defaultValue="Honda CR-V" />
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={() => handlePlaceholderAction('Save Personal Info')}>Save Changes</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carpool Preferences</CardTitle>
            <CardDescription>
              Fine-tune your preferences for better matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label>Smoking Preference</Label>
                <RadioGroup defaultValue="no" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="smoke-yes" />
                    <Label htmlFor="smoke-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="smoke-no" />
                    <Label htmlFor="smoke-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-3">
                <Label>Pets</Label>
                 <RadioGroup defaultValue="not-okay" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="okay" id="pets-okay" />
                    <Label htmlFor="pets-okay">Okay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-okay" id="pets-not-okay" />
                    <Label htmlFor="pets-not-okay">Not Okay</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="grid gap-2">
                <Label htmlFor="music">Music Preference</Label>
                <Select defaultValue="pop">
                  <SelectTrigger id="music">
                    <SelectValue placeholder="Select music preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rap">Rap</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="talkativeness">Talkativeness</Label>
                <Select defaultValue="neutral">
                  <SelectTrigger id="talkativeness">
                    <SelectValue placeholder="Select talkativeness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiet">Quiet</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="chatty">Chatty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
           <CardFooter className="border-t px-6 py-4">
            <Button onClick={() => handlePlaceholderAction('Save Preferences')}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid md:col-span-1 gap-8">
         <Card>
            <CardHeader>
                <CardTitle>Ratings & Reviews</CardTitle>
                <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    <span className="text-muted-foreground ml-2">(4.2 from {userReviews.length} reviews)</span>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">AI Summary</CardTitle>
                        <Button variant="ghost" size="icon" onClick={generateSummary} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {summary}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Separator />
                <div className="space-y-4">
                    {userReviews.slice(0, 2).map((review, index) => (
                         <div className="flex gap-4" key={index}>
                            <Avatar>
                                <AvatarImage src={`https://placehold.co/40x40.png?text=U${index+1}`} data-ai-hint="user avatar" />
                                <AvatarFallback>U{index+1}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm text-muted-foreground">"{review}"</p>
                            </div>
                        </div>
                    ))}
                </div>

            </CardContent>
         </Card>
      </div>
    </div>
  );
}
