import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerLoginUser } from "./redux/slices/authSlice";
import { useTranslation } from "react-i18next";

// Pages
import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";
import MyFarms from "./pages/MyFarms";
import CropgenBot from "./pages/CropgenBot";
import PreferredLanguage from "./pages/PreferredLanguage";
import AddField from "./pages/AddField";
import MandiRates from "./pages/Mandirates";
import Cropinformation from "./components/cropinformation/Cropinformation";
import CropInfoDynamic from "./components/cropinformation/Cropinfo";
import Profile from "./pages/Profile";

import { decodeJwt } from "./utils/tokenutils";

const AUTH_QUERY_CACHE_KEY = "lastAuthQueryParams";
const AUTH_TOKEN_CACHE_KEY = "lastAuthToken";

function App() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    // LANGUAGE HANDLING
    const lang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    const showError = (msg) => {
      console.error(msg);
      setErrorModal({
        open: true,
        message: msg,
      });
    };

    // ---- TRY TOKEN-BASED FLOW FIRST ----
    const token = searchParams.get("token")?.trim() || "";

    if (token) {
      // Avoid re-processing the same token
      try {
        const cachedToken = sessionStorage.getItem(AUTH_TOKEN_CACHE_KEY);
        if (cachedToken && cachedToken === token) {
          return;
        }
      } catch (err) {
        console.warn("Failed to read cached auth token:", err);
      }

      let decoded;
      try {
        decoded = decodeJwt(token);
      } catch (err) {
        showError("Invalid or expired token. Please try again.");
        return;
      }

      // Expecting these fields from backend token payload
      let { phone, email, firstName, lastName, organizationCode, terms } =
        decoded || {};

      // Basic validations
      if (!phone || !organizationCode) {
        showError("Invalid token payload: missing phone or organization code.");
        return;
      }

      // ---- NORMALIZE PHONE ----
      const normalizePhone = (raw) => {
        if (!raw) return "";
        let p = String(raw).trim();

        // If already in +91XXXXXXXXXX format
        if (p.startsWith("+91")) return p;

        // If starts with 91 but without +
        if (p.startsWith("91")) {
          return `+${p}`;
        }

        // Remove leading zeros and add +91
        p = p.replace(/^0+/, "");

        // If user added some other country code like +1, keep as-is
        if (p.startsWith("+") && !p.startsWith("+91")) {
          return p;
        }

        // Default: treat as Indian local number and prefix +91
        return `+91${p}`;
      };

      phone = normalizePhone(phone);

      const isValidPhone = (num) => /^\+?\d{10,15}$/.test(num);
      const isValidEmail = (mail) =>
        !mail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
      const isValidName = (name) => !name || /^[A-Za-z\s]+$/.test(String(name));

      if (!isValidPhone(phone)) {
        showError("Invalid phone number in token payload.");
        return;
      }

      if (!isValidEmail(email)) {
        showError("Invalid email in token payload.");
        return;
      }

      if (!isValidName(firstName) || !isValidName(lastName)) {
        showError("Invalid name in token payload.");
        return;
      }

      const currentPayload = {
        phone,
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        organizationCode,
        terms: terms === true || terms === "true",
      };

      // ---- CLEAR OLD AUTH ----
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      const processAuthWithToken = async () => {
        try {
          await dispatch(registerLoginUser(currentPayload)).unwrap();

          // cache token on success
          sessionStorage.setItem(AUTH_TOKEN_CACHE_KEY, token);

          navigate("/", { replace: true });
        } catch (err) {
          console.error("Register/Login with token failed:", err);

          const apiMessage =
            typeof err === "string"
              ? err
              : err?.message ||
                err?.error ||
                "Something went wrong while registering. Please try again.";

          setErrorModal({
            open: true,
            message: apiMessage,
          });
        }
      };

      processAuthWithToken();
      return; // do not run the old query-param flow if token is present
    }

    // ---- FALLBACK: OLD QUERY PARAM FLOW (phone, email, firstName, lastName) ----
    let phone = searchParams.get("phone")?.trim() || "";
    const email = searchParams.get("email")?.trim() || "";
    const firstName = searchParams.get("firstName")?.trim() || "";
    const lastName = searchParams.get("lastName")?.trim() || "";

    // If required params are not present, do nothing
    if (!phone || !email || !firstName || !lastName) return;

    // ---- NORMALIZE PHONE ----
    const normalizePhone = (raw) => {
      if (!raw) return "";
      let p = raw.trim();

      // If already in +91XXXXXXXXXX format
      if (p.startsWith("+91")) return p;

      // If starts with 91 but without +
      if (p.startsWith("91")) {
        return `+${p}`;
      }

      // Remove leading zeros and add +91
      p = p.replace(/^0+/, "");

      // If user added some other country code like +1, keep as-is
      if (p.startsWith("+") && !p.startsWith("+91")) {
        return p;
      }

      // Default: treat as Indian local number and prefix +91
      return `+91${p}`;
    };

    phone = normalizePhone(phone);

    const isValidPhone = (num) => /^\+?\d{10,15}$/.test(num);
    const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);

    if (!isValidPhone(phone)) {
      showError("Invalid phone number. Please check the number and try again.");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (!isValidName(firstName)) {
      showError("Invalid first name. Only alphabets and spaces are allowed.");
      return;
    }

    if (!isValidName(lastName)) {
      showError("Invalid last name. Only alphabets and spaces are allowed.");
      return;
    }

    const currentPayload = { phone, email, firstName, lastName };

    // ---- CHECK IF PARAMS ARE NEW (OPTIMIZATION) ----
    try {
      const cached = sessionStorage.getItem(AUTH_QUERY_CACHE_KEY);
      if (cached) {
        const lastPayload = JSON.parse(cached);

        const isSamePayload =
          lastPayload.phone === currentPayload.phone &&
          lastPayload.email === currentPayload.email &&
          lastPayload.firstName === currentPayload.firstName &&
          lastPayload.lastName === currentPayload.lastName;

        // If same as last successful processed, do not call API again
        if (isSamePayload) return;
      }
    } catch (err) {
      console.warn("Failed to read cached auth params:", err);
    }

    // ---- CLEAR OLD AUTH ----
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    const processAuthWithQuery = async () => {
      try {
        await dispatch(registerLoginUser(currentPayload)).unwrap();

        sessionStorage.setItem(
          AUTH_QUERY_CACHE_KEY,
          JSON.stringify(currentPayload)
        );

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Register/Login failed:", err);

        const apiMessage =
          typeof err === "string"
            ? err
            : err?.message ||
              err?.error ||
              "Something went wrong while registering. Please try again.";

        setErrorModal({
          open: true,
          message: apiMessage,
        });
      }
    };

    processAuthWithQuery();
  }, [dispatch, i18n, searchParams, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/crop-information" element={<Cropinformation />} />
        <Route path="/mandi-rates" element={<MandiRates />} />
        <Route path="/cropinfo/:id" element={<CropInfoDynamic />} />
        <Route path="/my-farms" element={<MyFarms />} />
        <Route path="/cropgen-bot" element={<CropgenBot />} />
        <Route path="/preferred-language" element={<PreferredLanguage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t("somethingWentWrong") || "Something went wrong"}
            </h2>
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">
              {errorModal.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setErrorModal({
                    open: false,
                    message: "",
                  })
                }
                className="px-4 py-2 rounded-lg bg-[#075A53] text-white text-sm font-medium hover:opacity-90 transition"
              >
                {t("okay") || "Okay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
