const faqs = [
  {
    question: "Why is there a registration fee for teenagers?",
    answer: (
      <>
        <p>
          Summer Bible School is primarily designed for teenagers ages 12-15. The registration fee helps
          encourage commitment and supports the smooth delivery of the program.
        </p>
        <p>
          Although the classes are online, they still require a team to coordinate sessions, engage the children,
          communicate with parents, and provide a quality learning experience. The fee also helps provide a modest
          stipend for volunteers who dedicate time during the summer, because the workload is too much for one person
          to handle effectively.
        </p>
      </>
    ),
  },
  {
    question: "Why are Young Adults and Adults free?",
    answer: (
      <p>
        The older groups are included as an extension of the ministry rather than the primary focus. This gives people
        who may not have attended Summer Bible School when they were younger an opportunity to participate. Older
        participants are generally more independent, require less supervision, and can engage with less guidance, so
        they place less demand on the teaching team. That makes it possible to offer the program to them free of charge.
      </p>
    ),
  },
  {
    question: "What time is the Bible Study?",
    answer: (
      <p>
        Bible Study begins at 7 PM CST. Participants in other locations can use the time guide on the website to see
        what time that is in their country or city.
      </p>
    ),
  },
  {
    question: "Is the Bible Study in person or virtual?",
    answer: (
      <p>
        The Bible Study is virtual. Participants do not need to attend in person.
      </p>
    ),
  },
  {
    question: "Where will the Bible Study be hosted online?",
    answer: (
      <p>
        The Bible Study will be hosted on Google Meet. The Google Meet link will be shared in the WhatsApp group for
        registered participants.
      </p>
    ),
  },
  {
    question: "How will participants receive the Google Meet link?",
    answer: (
      <p>
        After registration, participants will be directed to the correct WhatsApp group. The Google Meet link, reminders,
        updates, and next steps will be shared inside that group.
      </p>
    ),
  },
  {
    question: "How long does the program run?",
    answer: (
      <p>
        The 2026 Summer Bible Study runs from Monday, June 29, 2026 through Friday, August 7, 2026. Sessions begin at
        7 PM CST.
      </p>
    ),
  },
];

export default function BibleStudyRegistrationFAQ() {
  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-lg bg-white/90 p-6 shadow-lg sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="font-montserrat text-2xl font-extrabold text-gray-900 md:text-4xl">
          Registration FAQ
        </h2>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          A few answers for parents and participants before completing registration.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none text-left font-semibold text-gray-900">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-xl leading-none text-[#C8385E] group-open:rotate-45">+</span>
              </span>
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-6 text-gray-700 md:text-base">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
