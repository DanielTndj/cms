import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@features/auth/login/components/page";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Desktop Left Column - Logo and Branding */}
      <div className="bg-muted relative hidden lg:block">
                <GalleryVerticalEnd className="size-6" />
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      
      {/* Mobile and Desktop Right Column */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Enhanced Mobile Logo Section */}
        <div className="lg:hidden">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Acme Inc.</h1>
              <p className="text-muted-foreground text-sm">Welcome to our platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}