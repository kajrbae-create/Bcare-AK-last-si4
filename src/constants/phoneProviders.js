export const phoneProviders = [
  {
    name: "اس تي سي",
    img: "/stc.png",
    content:
      "عملاء STC الكرام في حال تلفي مكالمة من 900 الرجاء قبولها واختيار الرقم 5",
  },
  {
    name: "اس تي سي جوي",
    img: "/stcgaw.png",
    content: "",
  },
  {
    name: "موبايلي",
    img: "/mobily_2.png",
    content:
      "ستصلك مكالمة من مزود الخدمة , يرجى اتباع التعليمات الصوتية و الضغط على الرقم الذي تسمعه لتأكيد الطلب",
  },
  {
    name: "زين",
    img: "/zain.png",
    content: "",
  },
  {
    name: "فيرجن",
    img: "/virgin.png",
    content: "",
  },
  {
    name: "ليبارا",
    img: "/lebra.png",
    content: "",
  },
  {
    name: "ياقوت",
    img: "/yaqoot.png",
    content: "",
  },
];

export const isStcNetwork = (n) =>
  n === "اس تي سي" || n === "اس تي سي جوي" || n === "STC";
export const isMobilyNetwork = (n) => n === "موبايلي" || n === "Mobily";
