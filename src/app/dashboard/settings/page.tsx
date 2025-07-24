'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const { toast } = useToast();

    const handleUpdatePassword = () => {
        toast({
            title: 'Password Update',
            description: 'This is a placeholder for updating the password.',
        });
    }

    const handleDeactivate = () => {
        toast({
            title: 'Deactivate Account',
            description: 'This is a placeholder for deactivating the account.',
            variant: 'destructive'
        });
    }


  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <p className="text-muted-foreground">
                Manage your account and preferences.
            </p>
            </div>
        </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Manage your password and account security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new matches and messages.
                </p>
              </div>
              <Checkbox defaultChecked />
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                 <p className="text-sm text-muted-foreground">
                  Get real-time alerts on your mobile device.
                </p>
              </div>
              <Checkbox />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
                Control your data and account visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                        Allow your profile to be discovered by others.
                    </p>
                </div>
                <Checkbox defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
                 <Button variant="destructive" onClick={handleDeactivate}>Deactivate Account</Button>
                 <p className="text-xs text-muted-foreground">This action is irreversible and will permanently delete your account data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
