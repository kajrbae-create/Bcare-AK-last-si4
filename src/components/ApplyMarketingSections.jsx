import { createElement, useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdCall } from "react-icons/md";

const insurerLogos = [
  ["/index_files/UCA.svg", "UCA"],
  ["/index_files/AlRajhi.svg", "الراجحي تكافل"],
  ["/index_files/Allianz.svg", "Allianz"],
  ["/index_files/Tawuniya.svg", "التعاونية"],
  ["/index_files/Amana.svg", "أمانة"],
  ["/index_files/AXA.svg", "AXA"],
  ["/index_files/MedGulf.svg", "ميدغلف"],
  ["/index_files/GGI.svg", "الخليجية العامة"],
];

const safeFeatures = [
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/insureOneMin.svg",
    "تأمينك في دقيقة",
    "نقارن لك كل عروض الأسعار بشكل فوري من كل شركات التأمين",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/sprateInsure.svg",
    "فصّل تأمينك",
    "أنواع تأمين متعددة: تأمين ضد الغير، تأمين مميز، تأمين شامل وقيمة تحمل متنوعة",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/priceLess.svg",
    "أسعار أقل",
    "عندنا فريق يراقب كل صغيرة و كبيرة في السوق و يضمن أن سعرك الأقل و المناسب لك وفق احتياجك",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/sechleInsure.svg",
    "جدول تأمينك",
    "نرسل لك إشعارات تذكيرية لتجديد تأمينك وتقدر تجدول تاريخ بدايته",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/wind.svg",
    "هب ريح",
    "نربط وثيقتك في أسرع وقت مع نظام المرور ونجم",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/discounts.svg",
    "خصومات تضبطك",
    "خصومات لبعض القطاعات الحكومية وشبه الحكومية والخاصة",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/benfit.svg",
    "منافع تحميك",
    "خطط تأمين متنوعة مع المرونة في تحديد المنافع الإضافية اللي تناسبك",
  ],
  [
    "https://bcare.com.sa/assets/images/WhyBCareMotor-icons/oneWay.svg",
    "مكان واحد",
    "تدير كل وثائقك إدارة إلكترونية كاملة من مكان واحد وتجددها في أي وقت",
  ],
];

const discounts = [
  ["نون", "خصم 15%", "https://bcare.com.sa/assets/images/none.svg"],
  [
    "روش ريحان",
    "خصم 15%",
    "https://bcare.com.sa/assets/images/RoshRayhaan.jpg",
  ],
  [
    "الوزن المثالي",
    "خصم 50%",
    "https://bcare.com.sa/assets/images/perfectWight.png",
  ],
  ["درايف7", "خصم 20%", "https://bcare.com.sa/assets/images/drive7.png"],
  ["سويتر", "خصم 20%", "https://bcare.com.sa/assets/images/swater.jpg"],
  ["سيفي", "خصم 10%", "https://bcare.com.sa/assets/images/sivvi.svg"],
  [
    "فيزيوثيرابيا",
    "خصم 20%",
    "https://bcare.com.sa/assets/images/Physiotherabia.jpg",
  ],
  ["نوفميد", "خصم 15%", "https://bcare.com.sa/assets/images/Group%206444.svg"],
];

const whyFeatures = [
  ["/mink.svg", "منك وفيك"],
  ["/offers.svg", "عروض تفهمك"],
  ["/price.svg", "سعر يرضيك"],
  ["/quick.svg", "إصدار سريع"],
  ["/nqast.svg", "نقسط تأمينك"],
  ["/fire.svg", "نفزع لك"],
];

const footerGroups = [
  {
    title: "عن بي كير",
    links: ["خصومات وريف", "سياسة الخصوصية", "الشروط والأحكام", "وظائف"],
  },
  {
    title: "منتجاتنا",
    links: [
      "تأمين المركبات",
      "التأمين الطبي",
      "تأمين السفر",
      "تأمين الأخطاء الطبية",
      "تأمين العمالة المنزلية",
    ],
  },
  {
    title: "الدعم الفني",
    links: ["المدونة", "إلغاء وثيقتك", "رفع تذكرة", "اطبع وثيقتك"],
  },
  {
    title: "روابط مهمة",
    links: [
      "هيئة التأمين",
      "طريقة رفع شكوى لهيئة التأمين",
      "قواعد ولوائح هيئة التأمين",
      "شهادة ضريبة القيمة المضافة",
    ],
  },
];

function SponsorSlider() {
  const [active, setActive] = useState(0);
  const visibleCount = 4;
  const maxIndex = insurerLogos.length - visibleCount;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current >= maxIndex ? 0 : current + 1));
    }, 3500);
    return () => window.clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="bg-[#f5f8fb] px-3 py-8 sm:py-12" dir="rtl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow-[0_8px_30px_rgba(20,99,148,0.1)] sm:px-8">
        <div className="flex w-[30%] md:w-[24%] sm:min-w-0 sm:pl-2 border-l border-[#d4dce3] text-center items-center  gap-x-2 justify-center">
          <div className="flex  min-w-[ flex-col items-center    pl-2 ">
            <span className="text-[10px] font-bold text-[#296393] sm:text-sm">
              مصرح من:
            </span>
            <img
              src="/AICC1.svg"
              alt="هيئة التأمين"
              className="mt-2 h-14 w-full object-contain sm:h-20"
            />
          </div>
          <div className="hidden md:flex flex-col items-center justify-center px-4">
            <span className="text-5xl font-bold text-[#146394]">23</span>
            <span className="text-nowrap text-[#146394] text-lg font-extrabold">
              شركة تأمين
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 sm:hidden">
            {/* <button
              type="button"
              aria-label="الشركات السابقة"
              onClick={() =>
                setActive((current) => (current ? current - 1 : maxIndex))
              }
              className="shrink-0 p-1 text-[#146394] cursor-pointer"
            >
              <FaChevronRight />
            </button> */}
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 overflow-hidden">
              {insurerLogos.slice(active, active + 3).map(([src, alt]) => (
                <div
                  key={src}
                  className="flex h-20 items-center justify-center"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-12 w-full object-contain"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="الشركات التالية"
              onClick={() =>
                setActive((current) => (current >= maxIndex ? 0 : current + 1))
              }
              className="shrink-0 p-1 text-[#146394] cursor-pointer"
            >
              <FaChevronLeft />
            </button>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {/* <button
              type="button"
              aria-label="الشركات السابقة"
              onClick={() =>
                setActive((current) => (current ? current - 1 : maxIndex))
              }
              className="p-2 text-[#146394]"
            >
              <FaChevronRight />
            </button> */}
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-4 overflow-hidden">
              {insurerLogos
                .slice(active, active + visibleCount)
                .map(([src, alt]) => (
                  <div
                    key={src}
                    className="flex h-28 items-center justify-center"
                  >
                    <img
                      src={src}
                      alt={alt}
                      className="max-h-16 w-full object-contain"
                    />
                  </div>
                ))}
            </div>
            <button
              type="button"
              aria-label="الشركات التالية"
              onClick={() =>
                setActive((current) => (current >= maxIndex ? 0 : current + 1))
              }
              className="p-2 text-[#146394] cursor-pointer"
            >
              <FaChevronLeft />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SafeInsurance() {
  return (
    <section className="bg-[#f5f8fb] px-3 pt-12 sm:pt-2" dir="rtl">
      <div className="mx-auto w-full">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-[#146394] sm:mb-12 sm:text-4xl">
          طريقك آمــن مع بي كير
        </h2>
        <div className="relative grid grid-cols-4 gap-1.5 sm:grid-cols-4 sm:gap-4 w-full">
          {safeFeatures.map(([image, title, description]) => (
            <article
              key={title}
              className="flex justify-center h-28 w-full flex-col items-center rounded-md bg-white px-1 md:pt-4 text-center shadow-[0_5px_20px_rgba(20,99,148,0.07)] sm:h-[316px] sm:rounded-3xl sm:px-3 sm:pt-10"
            >
              <img
                src={image}
                alt={title}
                className="h-6 w-6 object-contain sm:h-8 sm:w-9"
              />
              <div className="flex flex-col gap-y-0 sm:gap-y-7">
                <h3 className="h-1 pt-1.5 text-center text-xs font-extrabold text-[#146394] sm:h-12 sm:pt-2 sm:text-xl">
                  {title}
                </h3>
                <p className="mt-7 hidden text-center text-[12px] leading-4 text-[#296393] sm:block sm:text-[15px] sm:leading-6">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Discounts() {
  const [expanded, setExpanded] = useState(false);
  const visibleDiscounts = expanded ? discounts : discounts.slice(0, 8);

  return (
    <section className="bg-[#f5f8fb] px-3 py-12 sm:py-16" dir="rtl">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl font-extrabold text-[#146394] sm:text-4xl my-5">
          خصومات وريف
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#146394] sm:text-base">
          خصومات وعروض مباشرة من مختلف المتاجر العالمية والمحلية لعملاء بي كير
          (أفراد، شركات)
        </p>
        <div
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
          dir="ltr"
        >
          {visibleDiscounts.map(([name, discount, image]) => (
            <article
              key={name}
              className="flex min-h-[82px] items-center gap-2 rounded-lg bg-white px-3 py-1 text-right shadow-[0_5px_20px_rgba(20,99,148,0.08)] sm:min-h-[118px] sm:gap-4 sm:px-4"
            >
              <div className="flex-1 pr-3">
                <h3 className="text-sm font-extrabold text-[#146394] sm:text-base ">
                  {name}
                </h3>
                <p className="mt-1 text-sm font-extrabold text-[#146394] sm:text-base">
                  {discount}
                </p>
              </div>
              <img
                src={image}
                alt={name}
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
                onError={(event) => {
                  event.currentTarget.src = "/logo.svg";
                }}
              />
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-20 font-bold text-[#146394] underline underline-offset-4"
        >
          {expanded ? "عرض خصومات أقل" : "عرض المزيد من الخصومات"}
        </button>
      </div>
    </section>
  );
}

function WhyBcare() {
  return (
    <section className="bg-white px-3 py-12 sm:py-16" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-[#146394] sm:text-4xl">
          ليش بي كير خيارك الأول في التأمين؟
        </h2>
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 sm:gap-y-14">
          {whyFeatures.map(([image, title]) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 text-center text-[#146394]"
            >
              <img
                src={image}
                alt=""
                className="h-9 w-9 object-contain sm:h-12 sm:w-12"
              />
              <span className="text-base font-extrabold sm:text-lg">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterGroup({ group, index, openGroup, setOpenGroup }) {
  const isOpen = openGroup === index;
  return (
    <div className="border-b border-white/15 sm:border-0">
      <button
        type="button"
        onClick={() => setOpenGroup(isOpen ? -1 : index)}
        className="flex w-full items-center justify-between py-4 text-right text-base font-bold sm:mb-3 sm:block sm:cursor-default sm:p-0"
        aria-expanded={isOpen}
      >
        <span>{group.title}</span>
        <FaChevronDown className={`sm:hidden ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`${isOpen ? "block" : "hidden"} pb-3 sm:block sm:pb-0`}>
        {group.links.map((link) => (
          <span
            key={link}
            target="_blank"
            rel="noreferrer"
            className="block py-1 text-xs text-white/85 hover:text-[#f8a52c]"
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const [openGroup, setOpenGroup] = useState(-1);
  return (
    <footer className="bg-[#146b99] px-4 pb-6 pt-8 text-white w-full" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-7 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-start">
            <img
              src="/logo.svg"
              alt="بي كير"
              className="h-16 w-28 brightness-0 invert"
            />
            <span className="mt-2 text-lg font-extrabold tracking-wide flex gap-x-2 items-center">
              8001180044
              <MdCall />
            </span>
            <div className="mt-5 flex items-center justify-center gap-2 w-full">
              <img
                src="https://bcare.com.sa/assets/images/FooterImage/google%20store.svg"
                alt="App Store"
                className="h-9 w-auto"
              />
              <img
                src="https://bcare.com.sa/assets/images/FooterImage/apple%20store.svg"
                alt="Google Play"
                className="h-9 w-auto"
              />
              <img
                src="https://bcare.com.sa/assets/images/FooterImage/huawei%20store.svg"
                alt="App Gallery"
                className="h-9 w-auto"
              />
            </div>
          </div>
          <div className="grid flex-1 gap-x-8 sm:grid-cols-4 sm:pr-12">
            {footerGroups.map((group, index) => (
              <FooterGroup
                key={group.title}
                group={group}
                index={index}
                openGroup={openGroup}
                setOpenGroup={setOpenGroup}
              />
            ))}
          </div>
        </div>
        <div className="mt-7 flex flex-col-reverse items-center gap-6 border-t border-white/15 pt-5 sm:flex-row sm:justify-between">
          <p className="text-center text-[11px] font-bold sm:text-right">
            2026 © جميع الحقوق محفوظة، شركة عناية الوسيط لوساطة التأمين
          </p>
          <div className="flex items-center gap-2">
            {[
              [
                FaYoutube,
                "https://www.youtube.com/channel/UCAuOCfNoaW8xTCFAMI38Anw",
              ],
              [FaXTwitter, "https://twitter.com/bcareksa"],
              [FaLinkedinIn, "https://www.linkedin.com/company/bcareksa"],
              [FaInstagram, "https://instagram.com/bcareksa"],
              [FaFacebookF, "https://facebook.com/Bcareksa-115093535762889"],
            ].map(([Icon, href]) => (
              <span
                key={href}
                target="_blank"
                rel="noreferrer"
                aria-label="رابط اجتماعي"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#146394]"
              >
                {createElement(Icon, { className: "h-4 w-4" })}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ApplyMarketingSections() {
  return (
    <div className="w-full" dir="rtl">
      <SponsorSlider />
      <SafeInsurance />
      <Discounts />
      <WhyBcare />
      <Footer />
    </div>
  );
}
