export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export interface SeasonalDestination {
  id: string;
  name: string;

  searchQuery: string;
  imageUrl: string;
  tag?: string;
}

export const SEASON_LABELS: Record<SeasonId, string> = {
  spring: "Xuân",
  summer: "Hạ",
  autumn: "Thu",
  winter: "Đông",
};

export const SEASONAL_DESTINATIONS: Record<SeasonId, SeasonalDestination[]> = {
  spring: [
    {
      id: "dalat-spring",
      name: "Đà Lạt",
      searchQuery: "Đà Lạt, Lâm Đồng, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1580824378537-e119885b93f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8JUM0JTkxJUMzJUEwJTIwbCVFMSVCQSVBMXR8ZW58MHx8MHx8fDA%3D",
      tag: "Hoa, khí hậu dễ chịu",
    },
    {
      id: "hoian-spring",
      name: "Hội An",
      searchQuery: "Hội An, Quảng Nam, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80&auto=format&fit=crop",
      tag: "Phố cổ, đèn lồng",
    },
    {
      id: "ninhbinh-spring",
      name: "Ninh Bình",
      searchQuery: "Ninh Bình, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1531737212413-667205e1cda7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmluaCUyMGIlQzMlQUNuaHxlbnwwfHwwfHx8MA%3D%3D",
      tag: "Tràng An, hang động",
    },
    {
      id: "mocchau-spring",
      name: "Mộc Châu",
      searchQuery: "Mộc Châu, Sơn La, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
      tag: "Đồi chè, mận hoa",
    },
  ],
  summer: [
    {
      id: "sapa-summer",
      name: "Sa Pa",
      searchQuery: "Sa Pa, Lào Cai, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80&auto=format&fit=crop",
      tag: "Ruộng bậc thang, mát mẻ",
    },
    {
      id: "halong-summer",
      name: "Hạ Long",
      searchQuery: "Vịnh Hạ Long, Quảng Ninh, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80&auto=format&fit=crop",
      tag: "Vịnh biển, du thuyền",
    },
    {
      id: "phuquoc-summer",
      name: "Phú Quốc",
      searchQuery: "Phú Quốc, Kiên Giang, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80&auto=format&fit=crop",
      tag: "Biển đảo, resort",
    },
    {
      id: "danang-summer",
      name: "Đà Nẵng",
      searchQuery: "Đà Nẵng, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&auto=format&fit=crop",
      tag: "Biển Mỹ Khê",
    },
  ],
  autumn: [
    {
      id: "hanoi-autumn",
      name: "Hà Nội",
      searchQuery: "Hà Nội, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1676019266474-3538f3f19e6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SCVDMyVBMCUyMG4lRTElQkIlOTlpfGVufDB8fDB8fHww",
      tag: "Mùa thu, cổ kính",
    },
    {
      id: "mcc-autumn",
      name: "Mù Cang Chải",
      searchQuery: "Mù Cang Chải, Yên Bái, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
      tag: "Lúa chín vàng",
    },
    {
      id: "hue-autumn",
      name: "Huế",
      searchQuery: "Huế, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80&auto=format&fit=crop",
      tag: "Cố đô, ẩm thực",
    },
    {
      id: "tamdao-autumn",
      name: "Tam Đảo",
      searchQuery: "Tam Đảo, Vĩnh Phúc, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
      tag: "Sương mù, dễ chịu",
    },
  ],
  winter: [
    {
      id: "nhatrang-winter",
      name: "Nha Trang",
      searchQuery: "Nha Trang, Khánh Hòa, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1689326232193-d55f0b7965eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmhhJTIwdHJhbmd8ZW58MHx8MHx8fDA%3D",
      tag: "Biển ấm",
    },
    {
      id: "phuquoc-winter",
      name: "Phú Quốc",
      searchQuery: "Phú Quốc, Kiên Giang, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1581551395534-8e9e29d90caf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBoJUMzJUJBJTIwcXUlRTElQkIlOTFjfGVufDB8fDB8fHww",
      tag: "Tránh rét",
    },
    {
      id: "cantho-winter",
      name: "Cần Thơ",
      searchQuery: "Cần Thơ, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1680711211921-1b5ba9a25fd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YyVFMSVCQSVBN24lMjB0aCVDNiVBMXxlbnwwfHwwfHx8MA%3D%3D",
      tag: "Miền Tây, chợ nổi",
    },
    {
      id: "condao-winter",
      name: "Côn Đảo",
      searchQuery: "Côn Đảo, Bà Rịa - Vũng Tàu, Việt Nam",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
      tag: "Biển hoang sơ",
    },
  ],
};

export function getSeasonFromDate(date = new Date()): SeasonId {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}
