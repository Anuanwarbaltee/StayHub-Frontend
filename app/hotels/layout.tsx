import Footer from "../components/Footer";


export default function HotelsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="w-full mx-auto">
            {/* <Header /> */}
            {/* <Hero /> */}
            {children}
            <Footer />
        </main>
    );
}
