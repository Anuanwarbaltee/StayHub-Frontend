import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeClient from "./components/homeClient";
import { HotelMainPageData } from "./types/hotel"
import { GetHotelsResponse } from "./types/hotel"


async function getHotels(): Promise<HotelMainPageData> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/hotel/hotels", {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const json = await res.json() as GetHotelsResponse;

    if (!json.success) {
      throw new Error(json.message || "Request failed (success = false)");
    }



    return json.data;

  } catch (err) {
    console.error("getHotels failed:", err);
    throw err;
  }
}

export default async function HomePage() {
  const { hotels, pagination } = await getHotels();
  return (
    <main className="w-full mx-auto  pt-8">
      <Header />
      <HomeClient initialData={hotels} initialPagination={pagination} />
      <Footer />
    </main>
  );
}
