import Hero from "../../components/Hero";
import Card from "../../components/Card";

function Academics() {
  const programs = [
    {
      title: "Early Childhood Education",
      description:
        "Our foundational program focuses on nurturing creativity and curiosity in young learners through play-based learning.",
      image: "/images/academics-early.jpg",
    },
    {
      title: "Primary School",
      description:
        "A comprehensive curriculum emphasizing literacy, numeracy, and character development for students in grades 1-6.",
      image: "/images/academics-primary.jpg",
    },
    {
      title: "Junior Secondary",
      description:
        "We prepare learners for higher academic pursuits with a balanced focus on STEM, languages, and life skills.",
      image: "/images/academics-junior.jpg",
    },
    {
      title: "Senior Secondary",
      description:
        "Offering advanced courses in sciences, arts, and technical subjects to prepare learners for university and careers.",
      image: "/images/academics-senior.jpg",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Academics"
        subtitle="Comprehensive Programs for Every Stage of Learning"
        background="/images/academics-hero.jpg"
      />

      {/* Intro Section */}
      <section className="px-6 md:px-16 py-8 max-w-5xl mx-auto text-gray-700 space-y-6 text-center">
        <p className="text-lg leading-relaxed">
          Our school is committed to offering a well-rounded education that
          equips students with academic excellence, practical skills, and strong
          values. Each academic level is carefully designed to meet the needs of
          learners at that stage.
        </p>
      </section>

      {/* Academic Programs */}
      <section className="px-6 md:px-16 pb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              title={program.title}
              description={program.description}
              image={program.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Academics;
