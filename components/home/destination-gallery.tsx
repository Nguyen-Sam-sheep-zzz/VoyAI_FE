export default function DestinationGallery() {
  const destinations = [
    {
      id: 1,
      name: "Paris, Pháp",
      image: "/images/eiffel-tower-paris-iconic-landmark-romantic-city.jpg",
      description: "Thành phố tình yêu",
    },
    {
      id: 2,
      name: "Tokyo, Nhật Bản",
      image: "/images/tokyo-japan-neon-lights-modern-city-cherry-blossom.jpg",
      description: "Thành phố không ngủ",
    },
    {
      id: 3,
      name: "Barcelona, Tây Ban Nha",
      image: "/images/barcelona-sagrada-familia-architecture-gaudi-spain.jpg",
      description: "Kiến trúc độc đáo",
    },
    {
      id: 4,
      name: "New York, Mỹ",
      image: "/images/new-york-city-times-square-skyline-usa-manhattan.jpg",
      description: "Thành phố không bao giờ ngủ",
    },
    {
      id: 5,
      name: "Bali, Indonesia",
      image: "/images/bali-indonesia-tropical-beach-temple-rice-fields.jpg",
      description: "Thiên đường nhiệt đới",
    },
    {
      id: 6,
      name: "Dubai, UAE",
      image: "/images/dubai-burj-khalifa-desert-golden-sand-uae-modern.jpg",
      description: "Tương lai hiện đại",
    },
    {
      id: 7,
      name: "Rome, Ý",
      image: "/images/rome-italy-colosseum-ancient-architecture-history.jpg",
      description: "Thành phố vĩnh cửu",
    },
    {
      id: 8,
      name: "Sydney, Úc",
      image: "/images/sydney-opera-house-harbour-bridge-australia-ocean.jpg",
      description: "Cảnh quan tuyệt đẹp",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khám Phá <span className="text-amber-600">Những Điểm Đến Hấp Dẫn</span>
          </h2>
          <p className="text-lg text-gray-600">
            Hơn 1000 điểm đến đang chờ bạn khám phá. Chọn nơi bạn muốn đi tiếp theo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative overflow-hidden h-48 bg-gray-200">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-sm text-white font-medium">{destination.description}</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">{destination.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
