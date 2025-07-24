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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const myGroups: any[] = []
const suggestedGroups: any[] = []

export default function GroupsPage() {
    const { toast } = useToast();

    const handleAction = (groupName: string, action: 'View' | 'Join' | 'Create') => {
        toast({
            title: `${action} Group`,
            description: `This is a placeholder for ${action.toLowerCase()}ing the "${groupName}" group.`,
        });
    }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Groups</h1>
          <p className="text-muted-foreground">
            Join groups to find rides with your community.
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleAction('New Group', 'Create')}>
            <PlusCircle className="h-5 w-5" /> Create Group
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">My Groups</h2>
        {myGroups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.map(group => (
                    <Card key={group.name} className="overflow-hidden">
                        <div className="relative h-32 w-full">
                            <Image src={group.image} alt={group.name} fill style={{objectFit: 'cover'}} data-ai-hint={group.dataAiHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{group.members} members</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => handleAction(group.name, 'View')}>View Group</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
            <Card className="text-center p-8">
                <CardTitle>No Groups Joined</CardTitle>
                <CardDescription>You haven't joined any groups yet. Check out the suggestions below!</CardDescription>
            </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Suggested Groups</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedGroups.length > 0 ? (
                suggestedGroups.map(group => (
                    <Card key={group.name} className="overflow-hidden">
                        <div className="relative h-32 w-full">
                            <Image src={group.image} alt={group.name} fill style={{objectFit: 'cover'}} data-ai-hint={group.dataAiHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{group.members} members</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleAction(group.name, 'Join')}>Join Group</Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                 <Card className="md:col-span-3 text-center p-8">
                    <CardTitle>No Group Suggestions</CardTitle>
                    <CardDescription>We'll suggest groups as you add schedules and interact with the app.</CardDescription>
                 </Card>
            )}
        </div>
      </div>
    </div>
  );
}
