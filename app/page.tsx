
import Header from "./common/header";
import LandingPage from "./common/parts/landingpage";

export default function Home() {
  return (
    <>
    <div className="w-full min-h-screen bg-white dark:bg-black">
      <Header />
      <LandingPage />
    </div>
    </>
  );
}
