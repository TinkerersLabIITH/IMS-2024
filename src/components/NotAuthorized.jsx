/**
 * v0 by Vercel.
 * @see https://v0.dev/t/yr2oMHjUSsz
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "./ui/button"

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <LockIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Unauthorized Access</h1>
        <p className="mt-4 text-white">
          You do not have permission to access the requested content. Please contact the site administrator or try
          logging in again.
        </p>
        <div className="mt-6">
          <Button
            href="#"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}