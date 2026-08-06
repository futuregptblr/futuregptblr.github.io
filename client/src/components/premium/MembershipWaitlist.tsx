import React, { useState } from "react";
import {
  Crown,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import type { User } from "../../types";
import { API_BASE_URL } from "../../lib/utils";
import { toast } from "react-toastify";

const benefits: string[] = [
  "Access to exclusive premium events",
  "Priority registration for workshops",
  "Direct networking with industry leaders",
  "Premium job board access",
  "Exclusive premium community channels",
  "Early access to new features",
  "Premium member badge",
  "Membership valid for 2 years",
];

interface MembershipWaitlistProps {
  user: User | null;
}

interface WaitlistFormData {
  name: string;
  email: string;
  mobile: string;
  location: string;
}

const MembershipWaitlist: React.FC<MembershipWaitlistProps> = ({ user }) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: "",
    email: "",
    mobile: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/waitlist/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Successfully joined waitlist! We'll notify you when premium membership becomes available.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to join waitlist. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast.error("Failed to join waitlist. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="pt-20 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-3">
                <Crown className="h-8 w-8 text-yellow-600 mr-2" />
                <h2 className="text-2xl font-bold text-yellow-800">
                  You're already Premium
                </h2>
              </div>
              <p className="text-yellow-700">
                Enjoy your benefits on the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
            <div className="p-6 md:p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-3">
                You're on the waitlist!
              </h2>
              <p className="text-green-700 mb-4">
                Thank you for your interest in FutureGPT Premium. We'll notify
                you as soon as membership becomes available.
              </p>
              <p className="text-sm text-gray-600">
                We'll send updates to <strong>{formData.email}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 mb-10 md:pt-20 bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero / Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-7 w-7" />
              <span className="text-sm md:text-base font-medium tracking-wide">
                Premium Membership
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Join the Premium Waitlist
            </h1>
            <p className="mt-2 md:mt-3 text-white/90 max-w-2xl">
              Premium membership is temporarily paused for updates. Join our
              waitlist to be the first to know when it's back!
            </p>

            <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 text-blue-900 px-4 py-2">
                <span className="text-sm font-semibold">Coming Soon</span>
              </div>
              <div className="text-sm md:ml-2 text-white/90">
                Regular price <span className="line-through">₹9,999</span> ·
                Launch offer <span className="font-bold">₹4,999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Benefits */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Everything included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-start text-sm text-gray-700"
                  >
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 text-blue-800 text-sm p-3">
                Membership validity: <strong>2 years</strong>
              </div>

              {/* Value stats to enrich left column */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-xl font-extrabold text-gray-900">
                    200+
                  </div>
                  <div className="text-xs text-gray-600">Premium events</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-xl font-extrabold text-gray-900">
                    1,000+
                  </div>
                  <div className="text-xs text-gray-600">Active members</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-xl font-extrabold text-gray-900">
                    2 years
                  </div>
                  <div className="text-xs text-gray-600">
                    Full access period
                  </div>
                </div>
              </div>

              {/* Testimonials to balance layout visually */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4">
                  <p className="text-sm text-gray-700">
                    "Premium helped me land two interviews through the job board
                    and meet mentors I still talk to."
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    — Ananya, Data Scientist
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4">
                  <p className="text-sm text-gray-700">
                    "Workshops were top-notch and the community access is
                    totally worth it."
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    — Rohan, Product Engineer
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Join the Waitlist
                </h3>
                <p className="text-sm text-gray-600">
                  Be the first to know when premium membership becomes available
                  again.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city/location"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                </button>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                We'll notify you when premium membership becomes available.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipWaitlist;
