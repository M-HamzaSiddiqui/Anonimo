'use client';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className=" m-10 text-4xl font-bold mb-6 text-center text-purple-400">About Us</h1>

        <p className="text-lg leading-relaxed mb-6 text-center max-w-3xl mx-auto text-gray-300">
          Welcome to <span className="font-semibold text-purple-300">Anonylytics</span> — your go-to platform for creating powerful, dynamic forms with real-time analytics. Whether you&apos;re running quizzes, collecting feedback, or building surveys, we&apos;ve got the tools to help you make smarter decisions with your data.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              At Anonylytics, we believe in empowering users with intuitive tools to gather and understand data easily. Our mission is to bridge the gap between data collection and actionable insights with elegant and efficient design.
            </p>
          </div>

          <div className="bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Customizable form builder with drag-and-drop functionality</li>
              <li>Real-time analytics and visualizations</li>
              <li>Quiz scoring and performance breakdown</li>
              <li>Seamless user experience with authentication and reCAPTCHA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Built with ❤️ by developers who care about simplicity and user experience.
          </p>
        </div>
      </div>
    </div>
  );
}
