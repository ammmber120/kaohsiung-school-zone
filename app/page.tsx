export default function Home() {
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
            className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-500"
          />

          <button className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
            開始查詢
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">查詢結果</h2>
          <p className="text-gray-500">
            目前尚未查詢。下一步我們會接上地址判斷與學區資料。
          </p>
        </div>
      </div>
    </main>
  );
}