"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axiosInstance from "@/lib/axios";
import { FiTarget, FiUsers, FiDollarSign, FiHeart } from "react-icons/fi";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";

const banners = [
  {
    title: "Fund the Future",
    subtitle: "Support creative projects and bring ideas to life",
    bg: "bg-peyara-primary",
    text: "text-peyara-dark",
    primaryBtn: { label: "Explore Campaigns", href: "/explore" },
    secondaryBtn: { label: "Get Started", href: "/register" },
  },
  {
    title: "Be a Creator",
    subtitle: "Share your vision with the world and get funded",
    bg: "bg-peyara-secondary",
    text: "text-white",
    primaryBtn: { label: "Start Creating", href: "/register" },
    secondaryBtn: { label: "View Campaigns", href: "/explore" },
  },
  {
    title: "Make an Impact",
    subtitle: "Every contribution counts toward something amazing",
    bg: "bg-peyara-accent",
    text: "text-peyara-dark",
    primaryBtn: { label: "Back a Project", href: "/explore" },
    secondaryBtn: { label: "Join Now", href: "/register" },
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Creator",
    text: "Peyaraful helped me fund my art project in just two weeks. The community here is incredible!",
  },
  {
    name: "Mike Chen",
    role: "Supporter",
    text: "I love supporting indie creators. The platform makes it easy and rewarding to back projects.",
  },
  {
    name: "Emily Davis",
    role: "Creator",
    text: "As a first-time creator, I was nervous. But Peyaraful guided me through the whole process.",
  },
  {
    name: "James Wilson",
    role: "Supporter",
    text: "Great campaigns, great people. I have backed 10 projects so far and every one delivered.",
  },
];

const categories = [
  { name: "Technology", icon: "💻", count: "120+ campaigns" },
  { name: "Art & Design", icon: "🎨", count: "85+ campaigns" },
  { name: "Music", icon: "🎵", count: "60+ campaigns" },
  { name: "Film", icon: "🎬", count: "45+ campaigns" },
  { name: "Games", icon: "🎮", count: "70+ campaigns" },
  { name: "Education", icon: "📚", count: "55+ campaigns" },
];

export default function HomePage() {
  const { user } = useAuth();
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/top")
      .then((res) => setTopCampaigns(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Swiper */}
      <section>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full"
        >
          {banners.map((banner, i) => (
            <SwiperSlide key={i}>
              <div className={`${banner.bg} ${banner.text} py-20 px-4`}>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90">{banner.subtitle}</p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href={banner.primaryBtn.href}
                      className="px-8 py-3 bg-white text-peyara-dark rounded-lg hover:bg-peyara-bg transition font-semibold"
                    >
                      {banner.primaryBtn.label}
                    </Link>
                    <Link
                      href={user ? (user.role === "admin" ? "/dashboard/admin-home" : user.role === "creator" ? "/dashboard/creator-home" : "/dashboard/supporter-home") : banner.secondaryBtn.href}
                      className="px-8 py-3 border-2 border-current rounded-lg hover:bg-white/20 transition font-semibold"
                    >
                      {user ? "Dashboard" : banner.secondaryBtn.label}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Top Funded Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-peyara-dark mb-2">
          Top Funded Campaigns
        </h2>
        <p className="text-center text-gray-600 mb-10">Support the most popular projects</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCampaigns.length > 0 ? (
            topCampaigns.map((campaign) => {
              const progress = Math.min(
                (campaign.amount_raised / campaign.funding_goal) * 100,
                100
              );
              return (
                <Link
                  key={campaign._id}
                  href={`/campaign/${campaign._id}`}
                  className="bg-white rounded-xl shadow-md border border-peyara-accent overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-peyara-accent/30 flex items-center justify-center overflow-hidden">
                    {campaign.image_url ? (
                      <img
                        src={campaign.image_url}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🎯</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-peyara-dark mb-1 truncate">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">by {campaign.creator_name}</p>
                    <div className="w-full bg-peyara-bg rounded-full h-2 mb-2">
                      <div
                        className="bg-peyara-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-semibold text-peyara-dark">
                        ${campaign.amount_raised.toLocaleString()}
                      </span>
                      <span>
                        {progress.toFixed(0)}% of ${campaign.funding_goal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-peyara-accent p-4 animate-pulse">
                  <div className="h-48 bg-peyara-accent/30 rounded-lg mb-4" />
                  <div className="h-4 bg-peyara-accent/30 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-peyara-accent/30 rounded w-1/2" />
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 border-y border-peyara-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-peyara-dark mb-2">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-10">Three simple steps to get started</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-peyara-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTarget size={28} className="text-peyara-dark" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-peyara-dark">1. Choose a Campaign</h3>
              <p className="text-gray-600 text-sm">Browse through exciting projects and find one that speaks to you.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-peyara-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-peyara-dark">2. Back It</h3>
              <p className="text-gray-600 text-sm">Purchase credits and contribute to help the project reach its goal.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-peyara-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign size={28} className="text-peyara-dark" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-peyara-dark">3. See It Happen</h3>
              <p className="text-gray-600 text-sm">Watch funded projects come to life and enjoy the rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 border border-peyara-accent shadow-sm">
              <FiUsers className="mx-auto mb-2 text-peyara-primary" size={32} />
              <p className="text-3xl font-bold text-peyara-dark">500+</p>
              <p className="text-gray-600 text-sm">Active Users</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-peyara-accent shadow-sm">
              <FiTarget className="mx-auto mb-2 text-peyara-secondary" size={32} />
              <p className="text-3xl font-bold text-peyara-dark">120+</p>
              <p className="text-gray-600 text-sm">Campaigns Funded</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-peyara-accent shadow-sm">
              <FiDollarSign className="mx-auto mb-2 text-peyara-primary" size={32} />
              <p className="text-3xl font-bold text-peyara-dark">$50K+</p>
              <p className="text-gray-600 text-sm">Total Raised</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-peyara-accent shadow-sm">
              <FiHeart className="mx-auto mb-2 text-peyara-secondary" size={32} />
              <p className="text-3xl font-bold text-peyara-dark">1000+</p>
              <p className="text-gray-600 text-sm">Contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16 border-y border-peyara-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-peyara-dark mb-2">
            Explore Categories
          </h2>
          <p className="text-center text-gray-600 mb-10">Find projects that match your interests</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/explore"
                className="bg-peyara-bg rounded-xl p-6 text-center hover:shadow-md border border-peyara-accent transition"
              >
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <h3 className="font-semibold text-peyara-dark text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-peyara-dark mb-2">
            What People Say
          </h2>
          <p className="text-center text-gray-600 mb-10">Hear from our community</p>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-xl p-6 shadow-md border border-peyara-accent h-full">
                  <p className="text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-peyara-primary flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-peyara-dark text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-peyara-dark py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-peyara-primary/80 mb-8 text-lg">
            Join Peyaraful Crowdfunding today and help bring creative visions to life.
          </p>
          <Link
            href={user ? (user.role === "admin" ? "/dashboard/admin-home" : user.role === "creator" ? "/dashboard/creator-home" : "/dashboard/supporter-home") : "/register"}
            className="px-8 py-3 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-white transition font-semibold text-lg"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
