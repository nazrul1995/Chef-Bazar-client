import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../components/Shared/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TbStarFilled, TbQuote } from "react-icons/tb";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ReviewSection = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['latestReviews'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/latest`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center text-white py-20">Loading reviews...</div>;

  return (
    <Container>
      <div className="py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">What Our Customers Say</h2>
        <p className="text-center text-orange-300 mb-12 text-lg">Real feedback from food lovers who can't get enough!</p>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={40}
          slidesPerView={1}
          centeredSlides={true}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          // effect="coverflow" // Uncomment for 3D coverflow effect (add Coverflow module import)
          // coverflowEffect={{
          //   rotate: 0,
          //   stretch: 0,
          //   depth: 100,
          //   modifier: 2.5,
          //   slideShadows: true,
          // }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper pb-16"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id}>
              <div className="bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-orange-500/10 flex flex-col h-full hover:shadow-orange-500/20 hover:scale-105 transform transition-all duration-500">
                {/* Quote Icon */}
                <TbQuote className="text-orange-400 text-6xl mb-6 opacity-30" />

                {/* Comment */}
                <p className="text-gray-100 text-lg italic flex-grow leading-relaxed">
                  "{review.comment}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-orange-400 my-6">
                  {[...Array(5)].map((_, i) => (
                    <TbStarFilled
                      key={i}
                      size={28}
                      className={i < review.rating ? "text-orange-400 drop-shadow-md" : "text-gray-600"}
                    />
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center mt-auto">
                  <img
                    src={review.reviewerImage || 'https://via.placeholder.com/60'}
                    alt={`Profile of ${review.reviewerName}`}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-400/30 shadow-lg"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-white text-xl">{review.reviewerName}</h4>
                    <p className="text-gray-400 text-sm">
                      {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <div className="flex justify-center gap-8 mt-8">
          <button className="swiper-button-prev-custom bg-slate-800/50 p-3 rounded-full text-orange-400 hover:bg-orange-500/20 transition">
            <MdKeyboardArrowLeft size={32} />
          </button>
          <button className="swiper-button-next-custom bg-slate-800/50 p-3 rounded-full text-orange-400 hover:bg-orange-500/20 transition">
            <MdKeyboardArrowRight size={32} />
          </button>
        </div>

        <p className="text-center text-gray-400 mt-8">Delicious moments shared by our happy customers ❤️</p>
      </div>
    </Container>
  );
};

export default ReviewSection;