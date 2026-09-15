import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  computeOfferDisplayTotal,
  enrichOfferWithSelection,
  formatOfferPriceString,
  isFeatureChecked,
  toggleFeatureSelection,
} from "../utils/offerFeatureSelection";
import { saveCompanySelection } from "../utils/saveCompanySelection";
import { TailSpin } from "react-loader-spinner";
import { FaCarCrash, FaShieldAlt } from "react-icons/fa";
import { FaShieldHalved, FaStar } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
const ComprehensiveOffers = ({ loading, setLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataParam = queryParams.get("data") || "{}";
  const userData = JSON.parse(dataParam);

  const offers = [
    {
      company: 'تكافل الراجحي', logo: '/index_files/AlRajhi.svg', price: '1263', rating: 4,
      features: [
        {text: 'مسؤلية الطرف الثالث', price: 'مشمول'},
        {text: 'إعفاء من نسبة استهلاك قطع الغيار', price: 'مشمول'},
        {text: 'تكاليف حالات الطوارئ الطبية', price: 'مشمول'},
        {text: 'تغطیة ضد كسر الزجاج والحرائق والسرقة', price: 'مشمول'},
        {text: 'تغطية الخسارة الكلية أو الجزئية للمركبة', price: 'مشمول'}
      ]
    },
    {
      company: 'العربية للتأمين', logo: '/index_files/AICC.svg', price: '2781', rating: 5,
      features: [
        {text: 'تغطية الحوادث الشخصية للسائق فقط', price: '50 ريال'},
        {text: 'تغطية الحوادث الشخصية للركاب فقط', price: '280 ريال'},
        {text: 'تغطية دول مجلس التعاون الخليجي', price: '500 ريال'},
        {text: 'سيارة بديلة', price: '250 ريال'}
      ]
    },
    {
      company: 'الخليجية العامة', logo: '/index_files/GGI.svg', price: '1118', rating: 5,
      features: [
        {text: 'الاخطار الطبيعية', price: 'مشمول'},
        {text: 'الزجاج الأمامي والحرائق والسرقة', price: 'مشمول'},
        {text: 'المساعدة على الطريق', price: 'مشمول'},
        {text: 'مسؤولية الطرف الثالث عن الاضرار الجسدية', price: 'مشمول'},
        {text: 'تغطية الحوادث الشخصية للسائق فقط', price: '40 ريال'}
      ]
    },
    {
      company: 'ميدغلف', logo: '/index_files/MedGulf.svg', price: '2019', rating: 4,
      features: [
        {text: 'الاخطار الطبيعية', price: 'مشمول'},
        {text: 'ضرر كامل وجزئي', price: 'مشمول'},
        {text: 'الزجاج الأمامي والحرائق والسرقة', price: 'مشمول'},
        {text: 'سيارة بديلة', price: '350 ريال'}
      ]
    },
    {
      company: 'ولاء', logo: '/index_files/Walaa.svg', price: '1321', rating: 3,
      features: [
        {text: 'تغطية الحوادث الشخصية للسائق فقط', price: '50 ريال'},
        {text: 'المساعدة على الطريق', price: '50 ريال'},
        {text: 'سيارة بديلة', price: '450 ريال'},
        {text: 'تغطية الحوادث الشخصية للركاب فقط', price: '280 ريال'}
      ]
    },
    {
      company: 'أمانة', logo: '/index_files/Amana.svg', price: '1189', rating: 4,
      features: [
        {text: 'المساعدة على الطريق', price: 'مشمول'},
        {text: 'الوفاة والإصابة الجسدية والمصاريف الطبية', price: '50 ريال'},
        {text: 'تغطية الحوادث الشخصية للركاب فقط', price: '350 ريال'},
        {text: 'إيجار المركبة البديلة (10 أيام)', price: '300 ريال'},
        {text: 'تغطية الخليج والأردن', price: '600 ريال'}
      ]
    },
    {
      company: 'سلامة للتأمين التعاوني', logo: '/index_files/Salama.svg', price: '3517', rating: 5,
      features: [
        {text: 'سيارة بديلة', price: '575 ريال'},
        {text: 'المساعدة على الطريق', price: '345 ريال'},
        {text: 'الوفاة والإصابة الجسدية والمصاريف الطبية', price: '920 ريال'},
        {text: 'تغطية خارج المملكة', price: '920 ريال'}
      ]
    },
    {
      company: 'الدرع العربي للتأمين', logo: '/index_files/ArabianShield.svg', price: '1574', rating: 4,
      features: [
        {text: 'المسؤولية المدنية تجاه الغير (10 مليون)', price: 'مشمول'},
        {text: 'الاخطار الطبيعية', price: 'مشمول'},
        {text: 'ضرر كامل', price: 'مشمول'},
        {text: 'الزجاج الأمامي والحرائق والسرقة', price: 'مشمول'},
        {text: 'تغطية الحوادث الشخصية للسائق فقط', price: '60 ريال'}
      ]
    },
    {
      company: 'بروج للتأمين التعاوني', logo: '/index_files/Buruj.svg', price: '1422', rating: 3,
      features: [
        {text: 'تغطية الحوادث الشخصية للسائق فقط', price: '58.82 ريال'},
        {text: 'تغطية الحوادث الشخصية للركاب فقط', price: '411.74 ريال'},
        {text: 'استئجار سيارة (حد أقصى 2000 ريال)', price: '600 ريال'},
        {text: 'استئجار سيارة (حد أقصى 5000 ريال)', price: '1500 ريال'},
        {text: 'استئجار سيارة (حد أقصى 4000 ريال)', price: '1200 ريال'}
      ]
    },
    {
      company: 'GiG', logo: '/index_files/AXA.svg', price: '1920', rating: 5,
      features: [
        {text: 'الإصابة الجسدية للغير', price: 'مشمول'},
        {text: 'تلف ممتلكات الغير', price: 'مشمول'},
        {text: 'خسارة أو تلف مركبتك', price: 'مشمول'},
        {text: 'تغطية طبية طارئة (5000 ريال)', price: 'مشمول'},
        {text: 'الاخطار الطبيعية', price: 'مشمول'}
      ]
    },
    {
      company: 'الوطنية للتأمين', logo: '/index_files/Wataniya.svg', price: '2214', rating: 5,
      features: [
        {text: 'المسؤولية تجاه الغير (10 مليون ريال)', price: 'مشمول'},
        {text: 'تغطية الخسارة الكلية أو الجزئية', price: 'مشمول'},
        {text: 'تغطية السرقة والحرائق', price: 'مشمول'},
        {text: 'الكوارث الطبيعية', price: 'مشمول'},
        {text: 'مصاريف السحب', price: 'مشمول'}
      ]
    }
  ];

  const [featureSelection, setFeatureSelection] = useState({});

  const handleBuy = async (offer, offerIndex) => {
    const companyData = enrichOfferWithSelection(offer, offerIndex, featureSelection);
    await saveCompanySelection(userData, companyData);
    navigate(
      `/confirm?data=${encodeURIComponent(JSON.stringify({ ...userData, companyData }))}`
    );
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f4f7f6] font-[Tajawal] pb-12"
      dir="rtl"
    >
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <TailSpin
            height="50"
            width="50"
            color="#ffc107"
            ariaLabel="loading"
          />
          <h5 className="text-[#0f4c72] mt-3 font-bold text-lg">
            جاري جلب عروض التأمين الشامل...
          </h5>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-[0_2px_15px_rgba(0,0,0,0.05)] py-2 w-full z-20">
        <div className="flex justify-center items-center mx-auto px-4">

          <img
            src="/index_files/myclogo.jpg"
            alt="Logo"
            className="h-11 ml-2"
          />
        </div>
      </nav>

      {/* Hero */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="relative z-10  overflow-hidden rounded-t-[15px] md:rounded-t-[20px] rounded-b-[15px] md:rounded-b-[20px] bg-gradient-to-br from-[#0a2744] via-[#0d3550] to-[#051a2a] text-white w-11/12 my-2 ">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -left-16 bottom-[-80px] h-[200px] w-[200px] rounded-full border border-white/[0.05]" />

          <div
            className="container relative mx-auto max-w-[900px] px-5  py-10 text-right md:px-6 md:pb-20 "
            dir="rtl"
          >
            <div className="mb-6 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-sm text-white/90 md:text-[15px]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#3dd9a0] shadow-[0_0_12px_rgba(61,217,160,0.65)]" />
                <span className="font-semibold">
                  منصة مقارنة التأمين الأولى
                </span>
              </span>
              <span className="hidden text-white/30 sm:inline">|</span>
              <span className="inline-flex items-center gap-2 text-white/75">
                <FaShieldHalved
                  className="h-4 w-4 shrink-0 text-[#8ec5ff]"
                  aria-hidden
                />
                <span>مرخصة من ساما</span>
              </span>
            </div>

            <h1 className="mb-3 font-extrabold  tracking-tight text-white md:text-5xl text-[1.65rem] sm:text-4xl">
              قارن، أمّن، واستلم وثيقتك
              <br />
              خلال دقائق
            </h1>
            <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-lg">
              عروض فورية من أكثر من 20 شركة تأمين معتمدة
            </p>

            <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1  text-sm text-white/90 md:text-[15px]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#3dd9a0] shadow-[0_0_10px_rgba(61,217,160,0.65)]" />
                <span className="font-semibold">عروض فورية</span>
              </span>
              <span className="text-white/30">|</span>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#3dd9a0] shadow-[0_0_10px_rgba(61,217,160,0.65)]" />
              <span className="font-semibold text-white/90">
                20+ شركة تأمين
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-5  max-w-[1000px]">
        {/* Filter Wrapper */}
        <div className="bg-white p-4 rounded-[15px] mb-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex justify-center gap-4 flex-wrap">
          <Link
            to={`/third_party_offers?data=${dataParam}`}
            className="text-sm px-6 py-2.5 rounded-full border border-gray-200 text-gray-500 font-bold flex items-center gap-2 transition-all hover:bg-gray-50"
          >
            <FaShieldAlt /> ضد الغير
          </Link>
          <Link
            to={`/special_offers?data=${dataParam}`}
            className="text-sm px-6 py-2.5 rounded-full border border-gray-200 text-gray-500 font-bold flex items-center gap-2 transition-all hover:bg-gray-50"
          >
            <FaStar /> مميز
          </Link>
          <Link
            to={`/comprehensive_offers?data=${dataParam}`}
            className="text-sm px-6 py-2.5 rounded-full border border-transparent font-bold flex items-center gap-2 transition-all bg-[#d4eef5] text-[#0f4c72]"
          >
            <FaCarCrash /> شامل
          </Link>
        </div>

        <h5 className="mb-6 text-center font-bold text-xl text-[#0f4c72]">
          عروض التأمين الشامل المتاحة
        </h5>

        {/* Offers Grid */}
        <div className="flex flex-col gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-[#f6f7f7] rounded-[20px] overflow-hidden border border-[#e1e1e1]"
            >
              <div className="bg-white px-5 py-3 border-b border-[#eee] flex justify-between items-center">
                <div className="flex items-center">
                  <h6
                    className="m-0 font-bold text-[#4729ec] ml-3"
                    style={{ fontWeight: "800" }}
                  >
                    {offer.company}
                  </h6>
                  <div
                    className="bg-[#e8f6f9] text-[#0f4c72] px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 text-sm"
                    style={{ fontWeight: "800" }}
                  >
                    <FaCarCrash /> شامل
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-0">
                  <div className="md:w-2/12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-[#eee] pb-4 md:pb-0 md:pl-4 mb-4 md:mb-0">
                    <img
                      src={offer.logo}
                      className="w-[120px] h-auto mb-2"
                      alt={offer.company}
                    />
                    <div className="flex text-[#d4eef5] text-lg">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`fa fa-star ${star <= offer.rating ? "text-[#ffc107]" : ""}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="md:w-7/12 md:pl-4 border-b md:border-b-0 md:border-l border-[#eee] pb-4 md:pb-0 mb-4 md:mb-0">
                    <h6 className="font-bold mb-3 text-[#0f4c72] text-[0.95rem]">
                      المنافع الإضافية
                    </h6>
                    <div className="flex flex-col gap-2">
                      {offer.features.map((feature, fIndex) => {
                        const checked = isFeatureChecked(
                          featureSelection,
                          index,
                          fIndex,
                          feature,
                        );
                        return (
                          <label
                            key={fIndex}
                            className="flex justify-between items-center py-2 border-b border-[#e1e1e1] text-sm text-[#1579c3] cursor-pointer select-none"
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleFeatureSelection(
                                    setFeatureSelection,
                                    index,
                                    fIndex,
                                    feature,
                                  )
                                }
                                className={`w-4 h-4 shrink-0 ${checked ? "accent-green-500" : ""}`}
                              />
                              {feature.text}
                            </span>
                            <span
                              className={`min-w-[60px] text-left font-bold ${
                                checked ? "text-green-600" : "text-gray-500"
                              }`}
                            >
                              {feature.price}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:w-3/12 md:pr-4 flex flex-col justify-center">
                    <div className="bg-white rounded-[15px] p-5 border border-[#eee] text-center shadow-sm">
                      <div className="text-gray-500 text-xs mb-2">
                        الشروط والأحكام
                      </div>
                      <div className="flex justify-between mt-1 pt-1 font-extrabold text-[#f8a52c] text-lg items-center">
                        <span style={{ fontWeight: "800" }}>الإجمالي</span>
                        <span style={{ fontWeight: "800" }}>
                          {formatOfferPriceString(
                            computeOfferDisplayTotal(
                              offer,
                              index,
                              featureSelection,
                            ),
                          )}{" "}
                          ريال
                        </span>
                      </div>
                      <button
                        onClick={() => handleBuy(offer, index)}
                        className="bg-[#f8a52c] hover:bg-[#e08e1a] text-white w-full py-2.5 rounded-lg font-extrabold text-base mt-4 transition-colors"
                      >
                        اشتري الآن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveOffers;
