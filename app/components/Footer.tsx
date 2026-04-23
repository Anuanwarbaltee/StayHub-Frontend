export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <h3 className="text-white text-xl font-bold mb-4">StayHub</h3>
                    <p className="text-sm leading-relaxed">Making your travel dreams a reality since 2024. Premium stays at unbeatable prices.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">About Us</li>
                        <li className="hover:text-white cursor-pointer">Careers</li>
                        <li className="hover:text-white cursor-pointer">Blog</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Help Center</li>
                        <li className="hover:text-white cursor-pointer">Cancellation</li>
                        <li className="hover:text-white cursor-pointer">Privacy</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Contact</h4>
                    <p className="text-sm">support@stayhub.com</p>
                    <p className="text-sm">+1 (555) 000-0000</p>
                </div>
            </div>
        </footer>
    )
}