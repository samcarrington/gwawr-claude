<template>
  <div class="py-12">
    <UContainer>
      <!-- Page Header -->
      <div class="text-center mb-16">
        <PageTitle size="large" spacing="default">
          What People Say
        </PageTitle>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Here's what clients, colleagues, and collaborators have said about
          working with me. These testimonials reflect my commitment to quality,
          collaboration, and delivering exceptional results.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        role="list"
        aria-label="Client testimonials"
      >
        <TestimonialCard
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          :testimonial="testimonial"
          role="listitem"
        />
      </div>

      <!-- Call-to-Action Section -->
      <CallToAction
        variant="light"
        title="Ready to Work Together?"
        description="Join these satisfied clients and let's create something amazing together. I'm always excited to take on new challenges and deliver exceptional results."
      >
        <template #primary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="navigateTo('/projects')"
            aria-label="View my portfolio projects"
          >
            <UIcon name="i-heroicons-eye" class="mr-2" />
            View My Work
          </UButton>
        </template>
        <template #secondary-button="{ variant, classes }">
          <UButton
            size="lg"
            :variant="variant"
            :class="classes"
            @click="openEmailClient"
            aria-label="Send me an email to start a conversation"
          >
            <UIcon name="i-heroicons-envelope" class="mr-2" />
            Get In Touch
          </UButton>
        </template>
      </CallToAction>
    </UContainer>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Testimonials - Sam Carrington',
  meta: [
    {
      name: 'description',
      content:
        'Read what clients and colleagues say about working with Sam Carrington. Testimonials highlighting quality work, collaboration, and exceptional results.',
    },
  ],
});

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    content:
      'Sam delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise made the entire process smooth and efficient.',
    name: 'Sarah Chen',
    title: 'Product Manager',
    company: 'TechFlow Solutions',
    rating: 5,
  },
  {
    id: 2,
    content:
      'Working with Sam was a pleasure. He brought creative solutions to complex problems and delivered our project on time and within budget. Highly recommended!',
    name: 'Michael Rodriguez',
    title: 'CTO',
    company: 'InnovateLab',
    rating: 5,
  },
  {
    id: 3,
    content:
      'Sam has an incredible ability to translate business requirements into elegant technical solutions. His communication skills and professionalism are top-notch.',
    name: 'Emily Johnson',
    title: 'Digital Marketing Director',
    company: 'GrowthCo',
    rating: 5,
  },
  {
    id: 4,
    content:
      'The web application Sam built for us has significantly improved our workflow efficiency. His code quality and documentation made future updates seamless.',
    name: 'David Thompson',
    title: 'Operations Manager',
    company: 'StreamlineOps',
    rating: 5,
  },
  {
    id: 5,
    content:
      'Sam is a reliable and skilled developer who consistently delivers high-quality work. His problem-solving abilities and technical knowledge are impressive.',
    name: 'Lisa Park',
    title: 'Senior Developer',
    company: 'CodeCraft Studios',
    rating: 5,
  },
  {
    id: 6,
    content:
      'From initial consultation to final delivery, Sam provided excellent service. The responsive design and user experience of our new website are outstanding.',
    name: 'James Wilson',
    title: 'Creative Director',
    company: 'DesignForward',
    rating: 5,
  },
];

// Navigation functions
const openEmailClient = () => {
  const subject = encodeURIComponent("Let's work together!");
  const body = encodeURIComponent(
    'Hi Sam,\n\nI came across your testimonials and would love to discuss a potential project. Could we schedule a time to chat?\n\nBest regards,'
  );
  window.location.href = `mailto:sam@gwawr.com?subject=${subject}&body=${body}`;
};
</script>
