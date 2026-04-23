import Footer from "../components/Footer";

export default function HotelsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="w-full mx-auto  pt-8 bg-gray-50">
            {/* <Header /> */}
            {/* <Hero /> */}
            {children}
            <Footer />
        </main>
    );
}
