"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (!address.trim()) {
      setErrorMessage("請先輸入地址");
      setSubmittedAddress("");
      return;
    }

    setErrorMessage("");
    setSubmittedAddress(address);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          高雄市學區查詢網站
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          請輸入高雄市地址，查詢所屬里別、鄰別、國小與國中學區。
        </p>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            請輸入地址
          </label>

          <input
            type="text"
            placeholder="例如：高雄市三民區覺民路500號"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mb-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-500"
          />

          {errorMessage && (
            <p className="mb-4 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleSearch}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            開始查詢
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">查詢結果</h2>

          {submittedAddress ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">你輸入的地址：</span>
                {submittedAddress}
              </p>
              <p className="text-sm text-gray-500">
                下一步我們會把這裡接上真正的學區查詢結果。
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              目前尚未查詢。請先輸入地址，然後按「開始查詢」。
            </p>
          )}
        </div>
      </div>
    </main>
  );
}