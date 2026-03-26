import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { schoolZones } from "@/data/school-zones";

function toHalfWidth(text: string) {
  return text.replace(/[！-～]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  );
}

function normalizeText(text: string) {
  return toHalfWidth(text)
    .replace(/\s+/g, "")
    .replace(/臺/g, "台")
    .replace(/^高雄市/, "")
    .replace(/^[^區]+區/, "")
    .replace(/[，,]/g, "")
    .replace(/之/g, "-");
}

function addSuffix(value: string | null | undefined, suffix: string) {
  const cleanValue = (value ?? "").trim();
  if (!cleanValue) return "";
  return cleanValue.endsWith(suffix) ? cleanValue : `${cleanValue}${suffix}`;
}

function buildAddressFromRow(row: {
  street: string | null;
  area: string | null;
  lane: string | null;
  alley: string | null;
  number: string | null;
}) {
  const street = (row.street ?? "").trim();
  const area = (row.area ?? "").trim();
  const lane = addSuffix(row.lane, "巷");
  const alley = addSuffix(row.alley, "弄");
  const number = addSuffix(row.number, "號");

  return normalizeText(`${street}${area}${lane}${alley}${number}`);
}

function buildDisplayAddress(row: {
  street: string | null;
  area: string | null;
  lane: string | null;
  alley: string | null;
  number: string | null;
}) {
  const street = (row.street ?? "").trim();
  const area = (row.area ?? "").trim();
  const lane = addSuffix(row.lane, "巷");
  const alley = addSuffix(row.alley, "弄");
  const number = addSuffix(row.number, "號");

  return `${street}${area}${lane}${alley}${number}`;
}

function extractStreet(address: string) {
  const normalized = toHalfWidth(address)
    .replace(/\s+/g, "")
    .replace(/臺/g, "台")
    .replace(/^高雄市/, "")
    .replace(/^[^區]+區/, "");

  const match = normalized.match(/(.+?(路|街|大道))/);
  return match ? match[1].trim() : "";
}

type AddressRow = {
  city_code: string | null;
  district_code: string | null;
  village: string | null;
  neighborhood: string | null;
  street: string | null;
  area: string | null;
  lane: string | null;
  alley: string | null;
  number: string | null;
  x_coord: string | null;
  y_coord: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") ?? "").trim();

  if (!address) {
    return NextResponse.json(
      { found: false, message: "請先輸入地址" },
      { status: 400 }
    );
  }

  const target = normalizeText(address);
  const street = extractStreet(address);

  if (!street) {
    return NextResponse.json({
      found: false,
      message: "無法判斷路名，請輸入更完整的地址。",
    });
  }

  const { data, error } = await supabase
    .from("kaohsiung_addresses")
    .select(
      "city_code, district_code, village, neighborhood, street, area, lane, alley, number, x_coord, y_coord"
    )
    .eq("street", street)
    .limit(2000);

  if (error) {
    return NextResponse.json({
      found: false,
      message: "查詢 Supabase 失敗，請稍後再試。",
      error: error.message,
    });
  }

  const rows = (data ?? []) as AddressRow[];

  const exactMatch = rows.find((row) => {
    const rowAddress = buildAddressFromRow(row);
    return target === rowAddress;
  });

  const partialMatch = rows.find((row) => {
    const rowAddress = buildAddressFromRow(row);
    return (
      rowAddress &&
      (target.includes(rowAddress) || rowAddress.includes(target))
    );
  });

  const matchedRow = exactMatch || partialMatch;

  if (!matchedRow) {
    return NextResponse.json({
      found: false,
      message: "查不到完全符合的官方門牌資料，請確認地址是否完整。",
    });
  }

  const village = (matchedRow.village ?? "").trim();
  const neighborhoodRaw = (matchedRow.neighborhood ?? "").trim();
  const neighborhoodNumber =
    neighborhoodRaw.replace(/^0+/, "") || neighborhoodRaw;

  const schoolZone = schoolZones.find((item) => item.village === village);

  return NextResponse.json({
    found: true,
    matchedAddress: buildDisplayAddress(matchedRow),
    village,
    neighborhood: neighborhoodNumber ? `第 ${neighborhoodNumber} 鄰` : "",
    elementarySchool: schoolZone?.elementarySchool ?? "尚未建入",
    juniorHighSchool: schoolZone?.juniorHighSchool ?? "尚未建入",
    schoolNotes: schoolZone?.notes ?? "",
  });
}