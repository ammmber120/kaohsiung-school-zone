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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasResult = !!submittedAddress;

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
            onKeyDown={handleKeyDown}
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
          <h2 className="mb-4 text-xl font-semibold text-gray-900">查詢結果</h2>

          {hasResult ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">查詢地址</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {submittedAddress}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">所屬里別</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    寶珠里
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">所屬鄰別</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    第 12 鄰
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">國小學區</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    光武國小
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">國中學區</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    陽明國中
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                備註：目前顯示為展示用假資料，下一步會改接真正的高雄市學區資料。
              </div>
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