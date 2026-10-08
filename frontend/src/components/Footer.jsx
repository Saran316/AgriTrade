function Footer() {
    return (
        <footer className="mt-16 border-t bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid gap-8 md:grid-cols-3">

                    <div>
                        <h2 className="text-xl font-bold text-green-700">
                            🌾 AgriTrade
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Connecting farmers and buyers through a simple
                            digital marketplace.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800">
                            Quick Links
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p>Dashboard</p>
                            <p>Categories</p>
                            <p>Crops</p>
                            <p>Orders</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800">
                            AgriTrade
                        </h3>

                        <p className="mt-3 text-sm text-gray-600">
                            A full-stack agricultural marketplace built
                            with Spring Boot and React.
                        </p>
                    </div>

                </div>

                <div className="mt-8 border-t pt-5 text-center text-sm text-gray-500">
                    © 2026 AgriTrade. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;