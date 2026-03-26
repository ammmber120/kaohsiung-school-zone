"use client";

import { useState } from "react";

type AddressResult = {
  found: boolean;
  matchedAddress?: string;
  village?: string;
  neighborhood?: string;
  elementarySchool?: string;
  juniorHighSchool?: string;
  schoolNotes?: string;
  message?: string;
  error?: string;
};

export default function Home() {
  const [address, setAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<AddressResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!address.trim()) {
      setErrorMessage("請先輸入地址");
      setSubmittedAddress("");
      setResult(null);
      return;
    }

    setErrorMessage("");
    setSubmittedAddress(address);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/address?address=${encodeURIComponent(address)}`
      );
      const data: AddressResult = await response.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        message: "查詢失敗，請稍後再試一次。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          高雄市學區查詢網站
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          請輸入高雄市完整地址，查詢真實里別、鄰別、國小與國中學區。
        </p>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            請輸入地址
          </label>

          <input
            type="text"
            placeholder="例如：高雄市新興區七賢三路110號"
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
            {isLoading ? "查詢中..." : "開始查詢"}
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">查詢結果</h2>

          {!submittedAddress ? (
            <p className="text-gray-500">
              目前尚未查詢。請先輸入地址，然後按「開始查詢」。
            </p>
          ) : isLoading ? (
            <p className="text-gray-500">正在查詢官方資料...</p>
          ) : result?.found ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">你輸入的地址</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {submittedAddress}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">官方比對地址</p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {result.matchedAddress}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">真實里別</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.village}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">真實鄰別</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.neighborhood}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">國小學區</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.elementarySchool}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">國中學區</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.juniorHighSchool}
                  </p>
                </div>
              </div>

              {result.schoolNotes && (
                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                  {result.schoolNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <p>{result?.message ?? "查不到資料"}</p>
              {result?.error && (
                <p className="mt-2 break-all text-xs text-red-500">
                  {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}