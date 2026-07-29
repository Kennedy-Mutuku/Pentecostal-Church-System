
const BrothersFellowship = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">

            <div className="relative">
                <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 md:px-12">
                    {/* Header Section */}
                    <div className="mb-12 border-b-2 border-[#730051]/20 pb-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-[#730051] mb-4">
                            Brothers' Fellowship
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                            Building Strong Men in Christ
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
                        {/* Content Section */}
                        <div className="flex-1 space-y-8">
                            <div className="prose prose-lg max-w-none text-[#000000]">
                                <p className="text-lg leading-relaxed">
                                    The Brothers' Fellowship exists to equip men to grow spiritually, lead responsibly, and serve faithfully in the church and society.
                                    It is a place where men are challenged, encouraged, and strengthened through God's Word and brotherhood.
                                    We focus on spiritual growth, accountability, leadership development, and practical Christian living, fostering men who reflect Christ in every area of life.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg hover:border-[#730051] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#730051] font-bold text-lg mb-2">Timing</h4>
                                    <p className="text-[#000000]">Sunday Evenings</p>
                                    <p className="text-[#000000] font-medium">6:50pm - 8:50pm</p>
                                </div>
                                <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg hover:border-[#730051] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#730051] font-bold text-lg mb-2">Leadership</h4>
                                    <p className="text-[#000000]">Led by the</p>
                                    <p className="text-[#000000] font-medium">Brother-in-charge</p>
                                </div>
                            </div>
                            <div className="bg-[#730051]/5 p-6 rounded-lg">
                                <h4 className="text-[#730051] font-bold text-lg mb-3">Core Focus Areas</h4>
                                <ul>
                                    <li>Bible study and prayer meetings</li>
                                    <li>Men's mentorship and accountability groups</li>
                                    <li>Leadership and character development</li>
                                    <li>Service and outreach activities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrothersFellowship;