import Hero from "../../components/Hero";

function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="About Our School"
        subtitle="Nurturing Knowledge, Character, and Excellence"
        background="/images/about-hero.jpg"
      />

      {/* About Content */}
      <section className="px-6 md:px-16 py-8 max-w-5xl mx-auto text-gray-700 space-y-6">
        <p className="text-lg leading-relaxed">
          Our school has been a pillar of education and character-building for
          many years. We are committed to creating an environment where students
          can thrive academically, socially, and morally.
        </p>

        <p className="text-lg leading-relaxed">
          With a team of dedicated teachers and modern facilities, we provide
          holistic learning experiences that prepare students for future
          opportunities. Our curriculum integrates innovation and discipline to
          ensure our learners are ready to face the world.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 md:px-16 py-12 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-center md:text-left">
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h2>
            <p>
              To provide quality education that nurtures creativity, discipline,
              and critical thinking, empowering learners to excel in all aspects
              of life.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Our Vision</h2>
            <p>
              To be a leading educational institution that inspires lifelong
              learning, integrity, and positive impact in society.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
