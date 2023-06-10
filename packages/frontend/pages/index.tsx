import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isSignedIn, user } = useUser();
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
      <Head>
        <title>StockChecker</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      {user && !user?.publicMetadata.role && (
        <div className="alert alert-warning">
          <div className="flex-1">
            <label>
              You are not allowed to see the app, please contact an admin.
            </label>
          </div>
        </div>
      )}
      <div
        className="hero min-h-[400px] max-h-[400px]"
        style={{ backgroundImage: "url(/board_desktop.jpeg);" }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to StockChecker</h1>
            <p className="mb-5">
              This is a simple app to keep track of stock levels for your
              business. It is designed to be used as a Kanban board, with
              columns (swim lanes) for each status of stock. Items can be
              dragged and dropped between columns, and edited by clicking the
              Edit button.
            </p>
            {isSignedIn && user?.publicMetadata.role ? (
              <Link href={"/board"} className="btn btn-primary">
                Go to Board
              </Link>
            ) : (
              <></>
            )}
            {isSignedIn && !user?.publicMetadata.role ? (
              <button className="btn btn-primary">
                <SignOutButton />
              </button>
            ) : (
              <></>
            )}
            {!isSignedIn && (
              <button className="btn btn-primary">
                <SignInButton />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="hero min-h-[400px] px-8 mt-[200px] md:mt-0">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src="/editordrag.png"
            className="max-w-1/2 rounded-lg shadow-2xl"
            alt="Editor and Drag and Drop"
            width={400}
            height={400}
          />
          <div className="px-4">
            <h1 className="text-5xl font-bold text-left lg:text-center">
              Multiple ways to edit!
            </h1>
            <p className="py-6">
              Choose between using the Edit button or dragging and dropping
              items between columns. (Edit is only available for users with the
              edit role. )
            </p>
          </div>
        </div>
      </div>
      <div className="hero min-h-[400px] px-8 mt-[200px] md:mt-0">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Image
            src="/mobile.jpg"
            className="max-w-[300px] rounded-lg shadow-2xl"
            alt="Mobile Friendly"
            width={300}
            height={300}
          />
          <div className="px-4  text-left lg:text-center">
            <h1 className="text-5xl font-bold  text-left lg:text-center">
              Mobile Friendly!
            </h1>
            <p className="py-6">
              This app is designed to work on mobile devices as well as
              desktops.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
