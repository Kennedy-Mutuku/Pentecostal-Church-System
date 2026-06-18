import ictBoardImg from "../assets/Screenshot 2026-01-28 185706.png";
import editorialBoardImg from "../assets/IMG-20260129-WA0046.jpg";
import commBoardImg from "../assets/software comm.jpeg";
import mediaBoardImg from "../assets/screen-projector-projector-is-showing-video-digital-video-projector-action_345343-9289.jpg";

export const boards = [
    {
      id: "ict",
      title: "ICT Board",
      icon: "fas fa-laptop-code",
      image: ictBoardImg,
      description:
        "Consists of the public secretary as the overseer, with chairperson and secretary to the board nominated by the board members. Other members are approved by the board. Prepares and updates the RPC Nyamira database. Manages the Facebook account and the church website. Projects all the church activities.",
      social: [
        { icon: "fab fa-facebook", url: "https://www.facebook.com/share/18rhcZ1XpA/" },
      ],
      members: [
        {
          role: "Overseer",
          name: "Emmanuel Ombogo",
          phone: "+254717481883",
          image: "https://via.placeholder.com/80?text=ICT",
        },
        {
          role: "Chairperson",
          name: "Jona Rubia",
          phone: "+2547000000",
          image: "https://via.placeholder.com/80?text=ICT2",
        },
        {
          role: "Secretary",
          name: "Mbugua Emily ",
          phone: "+25470000000",
          image: "https://via.placeholder.com/80?text=ICT3",
        },
      ],
    },

    {
      id: "editorial",
      title: "Editorial Board",
      icon: "fas fa-pen-fancy",
      image: editorialBoardImg,
      description:
        "Consists of the board coordinator as overseer with chairperson and secretary nominated by the board members. Responsible for Beyond Horizon magazine and approved publications.",
      social: [
        { icon: "fab fa-instagram", url: "https://www.instagram.com/rpcnyamira/" },
      ],
      members: [
        {
          role: "Overseer",
          name: "Faith Halima",
          phone: "+254706434348",
          image: "https://via.placeholder.com/80?text=ED",
        },
        {
          role: "Chairperson",
          name: "Morgan Joseph",
          phone: "+254794292751",
          image: "https://via.placeholder.com/80?text=ED2",
        },
        {
          role: "Secretary",
          name: "Belle Waiganio",
          phone: "+2547000000",
          image: "https://via.placeholder.com/80?text=ED3",
        },
      ],
    },

    {
      id: "communication",
      title: "Communication Board",
      icon: "fas fa-comments",
      image: commBoardImg,
      description:
        "Consists of the board coordinator as the overseer, with the chairperson and secretary to the board nominated by the board members. Other members approved by the board. Responsible for publishing the Beyond Horizon magazine and any publication approved by the executive. Responsible for any sales of publications.",
      social: [
        { icon: "fab fa-tiktok", url: "https://www.tiktok.com/@rikurumapentecostal" }
      ],
      members: [
        {
          role: "Overseer",
          name: "Emmanuel Ombogo",
          phone: "+254717481883",
          image: "https://via.placeholder.com/80?text=COM",
        },
        {
          role: "Chairperson",
          name: "Eulhracia Awuor",
          phone: "+2547000000",
          image: "https://via.placeholder.com/80?text=COM2",
        },
        {
          role: "Secretary",
          name: "Christian Lihanga",
          phone: "+254798896671",
          image: "https://via.placeholder.com/80?text=COM3",
        },
      ],
    },

    {
      id: "media",
      title: "Media Board",
      icon: "fas fa-camera-retro",
      image: mediaBoardImg,
      description:
        "Responsible for photography, videography, livestreaming, editing, and documenting church activities and events. Consists of the public secretary as the overseer to the board, chairperson and secretary nominated by the board members. Other members approved by the board. Responsible for covering all church events through photography and videography, managing the RPC Nyamira YouTube channel, and advising the executive on buying, maintaining and disposing of board's assets.",
      social: [
        { icon: "fab fa-youtube", url: "https://www.youtube.com/@savedbychriststainedbylove" }
      ],
      members: [
        {
          role: "Overseer",
          name: "Emmanuel Ombogo",
          phone: "+254717481883",
          image: "https://via.placeholder.com/80?text=MED",
        },
        {
          role: "Chairperson",
          name: "Emmanuel John",
          phone: "070000000",
          image: "https://via.placeholder.com/80?text=MED2",
        },
        {
          role: "Secretary",
          name: "Roda",
          phone: "070000000",
          image: "https://via.placeholder.com/80?text=MED3",
        },
      ],
    },
    {
      id: "software",
      title: "Software Development & Maintenance Board",
      icon: "fas fa-code",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      description: "Building and sustaining the digital backbone of RPC Nyamira — one commit at a time, for the glory of God. Our board covers every facet of the church's technology stack — from design to deployment.",
      social: [],
      members: [
        {
          role: "Overseer",
          name: "Eng. Emmanuel Ombogo",
          phone: "+254 700 000 000",
          image: "https://via.placeholder.com/80?text=SDB",
        },
        {
          role: "Lead Developer",
          name: "Eng. Fancy Nateku Megiri",
          phone: "+254726379173",
          image: "https://via.placeholder.com/80?text=SDB2",
        },
        {
          role: "Secretary",
          name: "Eng. Lewis Muriu",
          phone: "+25479839835",
          image: "https://via.placeholder.com/80?text=SDB3",
        },
      ]
    }
];
