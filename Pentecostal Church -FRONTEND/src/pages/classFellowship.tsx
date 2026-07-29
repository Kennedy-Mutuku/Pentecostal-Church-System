
const ClassFellowship = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans">
            <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 md:px-12">
                {/* Header Section */}
                <div className="mb-12 border-b-2 border-[#3b1a62]/20 pb-6">
                    <h3 className="text-4xl md:text-5xl font-bold text-[#3b1a62] mb-4">
                        Class Fellowship
                    </h3>
                    <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                        Uniting Students Across Years
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Content Section */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-[#ffffff] p-6 border-l-4 border-[#3b1a62] shadow-sm">
                            <p className="text-lg leading-relaxed text-[#000000]">
                                Class fellowships are gatherings organized for students of specific year of study within the church community.
                                These fellowships provide a platform for members to connect, share experiences, and support each other in their spiritual journey.
                                These classes create an environment for deeper understanding of Scripture and meaningful fellowship.
                                Each class is designed to encourage participation, discussion, and spiritual growth in a friendly and supportive setting.
                                Class fellowships are usually held on Saturday mornings.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[#000000] leading-relaxed">
                                They often include activities such as Bible study, prayer sessions, and social events that foster a sense of belonging and camaraderie among class members.
                            </p>

                            <div className="bg-[#3b1a62]/5 p-6 rounded-lg">
                                <h4 className="text-[#3b1a62] font-bold text-lg mb-3">Key Purpose</h4>
                                <p className="text-[#000000]">
                                    This is where members get to discuss topical issues and matters concerning the classes.
                                    The fellowships may be combined or separate as agreed by the responsible leaders.
                                </p>
                            </div>
                            <div className="bg-[#ffffff] border border-[#3b1a62]/20 p-6 rounded-lg shadow-sm">
                                <h4 className="text-[#3b1a62] font-bold text-lg mb-4 uppercase tracking-wider">Program Structure</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Structured Bible lessons</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Group discussions and sharing</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Prayer and mutual encouragement</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#3b1a62] font-bold">•</span>
                                        <span>Fellowship and spiritual bonding</span>
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

export default ClassFellowship;