
const SistersFellowship = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">

            <div className="relative">
                <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 md:px-12">
                    {/* Header Section */}
                    <div className="mb-12 border-b-2 border-[#3b1a62]/20 pb-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-[#3b1a62] mb-4">
                            Sisters' Fellowship
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                            Empowering Women in Faith
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Content Section */}
                        <div className="flex-1 space-y-8">
                            <div className="prose prose-lg max-w-none text-[#000000]">
                                <p className="text-lg leading-relaxed">
                                    The Sisters' Fellowship is a vibrant community of women committed to growing spiritually, supporting one another, and serving God faithfully.
                                    It provides a safe and encouraging space where women of all ages can connect, learn, and walk together in their faith journey.
                                    Through Bible study, prayer, fellowship meetings, and outreach activities, we seek to build strong Christ-centered relationships that reflect God's love in our families, church, and community.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#ffffff] border border-[#3b1a62]/20 p-6 rounded-lg hover:border-[#3b1a62] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#3b1a62] font-bold text-lg mb-2">Timing</h4>
                                    <p className="text-[#000000]">Sunday Evenings</p>
                                    <p className="text-[#000000] font-medium">6:50pm - 8:50pm</p>
                                </div>
                                <div className="bg-[#ffffff] border border-[#3b1a62]/20 p-6 rounded-lg hover:border-[#3b1a62] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#3b1a62] font-bold text-lg mb-2">Leadership</h4>
                                    <p className="text-[#000000]">Led by the</p>
                                    <p className="text-[#000000] font-medium">Sister-in-charge</p>
                                </div>
                            </div>
                            <div className="bg-[#ffffff] border border-[#3b1a62]/20 p-6 rounded-lg shadow-sm">
                                <h4 className="text-[#3b1a62] font-bold text-lg mb-4 uppercase tracking-wider">Program Structure</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Weekly Bible study and prayer sessions</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Women's mentorship and encouragement</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Community outreach and charity initiatives</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Fellowship gatherings and special events</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SistersFellowship;