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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, MessageSquarePlus, Music, Mic, CigaretteOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

const matches = [
    { name: 'Alice', rating: 4.9, compatibility: 92, tags: ['Work', 'Quiet'], avatar: 'A', avatarImg: 'https://placehold.co/100x100.png?a=1' },
    { name: 'Bob', rating: 4.7, compatibility: 85, tags: ['School', 'Pop Music'], avatar: 'B', avatarImg: 'https://placehold.co/100x100.png?a=2' },
    { name: 'Charlie', rating: 5.0, compatibility: 81, tags: ['Gym', 'Chatty'], avatar: 'C', avatarImg: 'https://placehold.co/100x100.png?a=3' },
    { name: 'Diana', rating: 4.5, compatibility: 78, tags: ['Work', 'Pets Okay'], avatar: 'D', avatarImg: 'https://placehold.co/100x100.png?a=4' },
    { name: 'Ethan', rating: 4.8, compatibility: 75, tags: ['Work'], avatar: 'E', avatarImg: 'https://placehold.co/100x100.png?a=5' },
    { name: 'Fiona', rating: 4.6, compatibility: 68, tags: ['School', 'Rap'], avatar: 'F', avatarImg: 'https://placehold.co/100x100.png?a=6' },
]

export default function MatchesPage() {
  const { toast } = useToast();

  const handleConnect = (name: string) => {
    toast({
      title: 'Request Sent!',
      description: `Your chat request to ${name} has been sent.`,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your search</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label>Sort by</Label>
              <Select defaultValue="compatibility">
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compatibility">Compatibility</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                    <Slider defaultValue={[4]} max={5} step={0.1} />
                    <span className="text-sm font-medium w-12 text-right">4.0+</span>
                </div>
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-driver" />
                  <Label htmlFor="role-driver">Driver</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-passenger" />
                  <Label htmlFor="role-passenger">Passenger</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Music className="h-4 w-4" /> Music Preference</Label>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="hiphop">Hip Hop</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="quiet">Quiet Ride</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Mic className="h-4 w-4" /> Conversation Level</Label>
              <Select>
                  <SelectTrigger>
                      <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="quiet">Quiet</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="chatty">Chatty</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><CigaretteOff className="h-4 w-4" /> Smoking</Label>
               <div className="flex items-center space-x-2">
                  <Checkbox id="pref-smoking" defaultChecked />
                  <Label htmlFor="pref-smoking">No Smoking</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply Filters</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold font-headline">Available Matches</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Card key={match.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={match.avatarImg} data-ai-hint="person portrait" />
                    <AvatarFallback>{match.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{match.rating.toFixed(1)}</span>
                  </div>
                </div>
                <CardTitle className="pt-2">{match.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow grid gap-2">
                <div className="text-sm text-muted-foreground">
                  Compatibility: {match.compatibility}%
                </div>
                <Progress
                  value={match.compatibility}
                  aria-label={`${match.compatibility}% compatible`}
                />
                <div className="flex flex-wrap gap-1 pt-2">
                  {match.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="sm" onClick={() => handleConnect(match.name)}>
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
