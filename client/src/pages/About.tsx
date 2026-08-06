import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About FutureGPT
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering the next generation of AI enthusiasts, developers, and
            innovators through community-driven learning and collaboration.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            FutureGPT is dedicated to democratizing AI education and fostering a
            vibrant community of learners, practitioners, and innovators. We
            believe that artificial intelligence has the power to transform
            industries and improve lives, and we're committed to making this
            technology accessible to everyone.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Through our comprehensive learning resources, hands-on workshops,
            and collaborative projects, we aim to bridge the gap between
            theoretical knowledge and practical application in the field of AI.
          </p>
        </Card>

        {/* Vision Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To become the leading global community for AI education and
            innovation, where individuals from all backgrounds can learn, grow,
            and contribute to the future of artificial intelligence. We envision
            a world where AI knowledge is not a privilege but a fundamental
            skill accessible to all.
          </p>
        </Card>

        {/* What We Do Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Educational Programs
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Comprehensive AI courses and tutorials</li>
                <li>• Hands-on workshops and bootcamps</li>
                <li>• Industry expert-led sessions</li>
                <li>• Certification programs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community Building
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Local chapter meetups and events</li>
                <li>• Online forums and discussion groups</li>
                <li>• Mentorship programs</li>
                <li>• Collaborative project opportunities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Industry Connections
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Job placement assistance</li>
                <li>• Company partnerships</li>
                <li>• Internship opportunities</li>
                <li>• Career guidance and support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Research & Innovation
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cutting-edge AI research projects</li>
                <li>• Open-source contributions</li>
                <li>• Hackathons and competitions</li>
                <li>• Publication opportunities</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Values Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Accessibility
              </h3>
              <p className="text-gray-700">
                Making AI education accessible to everyone, regardless of
                background or experience level.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Collaboration
              </h3>
              <p className="text-gray-700">
                Fostering a collaborative environment where knowledge is shared
                and ideas flourish.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Innovation
              </h3>
              <p className="text-gray-700">
                Encouraging creative thinking and pushing the boundaries of
                what's possible with AI.
              </p>
            </div>
          </div>
        </Card>

        {/* Join Us Section */}
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Ready to be part of the AI revolution? Join thousands of learners,
            developers, and innovators who are shaping the future of artificial
            intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/chapters"
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Find Your Chapter
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
