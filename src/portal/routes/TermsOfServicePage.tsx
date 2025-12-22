import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Mail,
  Shield,
} from "lucide-react"

export const TermsOfServicePage = () => {
  return (
    <div className="container-custom pt-8 pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Terms of Service
        </h1>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 md:p-8 space-y-6">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Acceptance of Terms
              </h2>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Public Domain Content and Volunteer Operation
              </h2>
            </div>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                This website and all its content are in the public domain and
                operated entirely by volunteers. All information, data,
                documents, and materials provided on this website are in the
                public domain unless otherwise noted. Public domain content may
                be freely used, copied, distributed, and modified without
                permission or attribution, though attribution is appreciated.
              </p>
              <p>
                As a volunteer-operated resource, we encourage users to conduct
                their own independent research and verification of information.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                "AS IS" Disclaimer
              </h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-yellow-900 mb-3">
                ALL INFORMATION ON THIS WEBSITE IS PROVIDED "AS IS" WITHOUT
                WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-yellow-800">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of intellectual property rights</li>
                <li>Accuracy, completeness, or reliability of information</li>
                <li>
                  Freedom from errors, viruses, or other harmful components
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Limitation of Liability
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Under no circumstances shall the website operators,
                contributors, or affiliated parties be liable for any direct,
                indirect, incidental, special, consequential, or punitive
                damages arising from:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Your use of this website</li>
                <li>Any errors or omissions in the content</li>
                <li>
                  Any interruption or cessation of transmission to or from the
                  website
                </li>
                <li>Any bugs, viruses, or other harmful components</li>
                <li>Loss of data or information</li>
              </ul>
              <p>
                This limitation applies regardless of whether such damages arise
                from contract, tort, negligence, strict liability, or any other
                legal theory or otherwise.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              User Responsibilities and Research Guidelines
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p className="font-semibold">Users are solely responsible for:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Independent Verification:</strong> Conducting their
                  own research and verification of all information obtained from
                  this website
                </li>
                <li>
                  <strong>Following Source Links:</strong> Reviewing and
                  visiting the original source links and references provided on
                  our pages for complete and authoritative information
                </li>
                <li>
                  <strong>Cross-Referencing:</strong> Comparing information with
                  multiple reliable sources before making decisions
                </li>
                <li>
                  Determining the suitability of information for their intended
                  use
                </li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>
                  Any consequences resulting from their use of the website
                  content
                </li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <p className="font-semibold text-blue-800 mb-3">
                  We strongly encourage users to:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 text-blue-700">
                  <li>
                    Use the source links and references provided on each page to
                    access primary documents and official sources
                  </li>
                  <li>
                    Conduct independent research beyond the information
                    presented here
                  </li>
                  <li>
                    Consult official government websites and agencies for the
                    most current information
                  </li>
                  <li>
                    Verify dates, figures, and details through multiple
                    reputable sources
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              No Professional Advice
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Information on this website is not intended as professional advice
              (legal, medical, financial, or otherwise). Users should consult
              qualified professionals for specific advice related to their
              situations.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Source Links and External References
              </h2>
            </div>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                This website provides links to official sources, government
                documents, and other authoritative materials. Users are strongly
                encouraged to:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Click through and review all source links provided</li>
                <li>
                  Access primary documents and official publications referenced
                </li>
                <li>Verify information through the original sources</li>
                <li>Check for updates or amendments to referenced materials</li>
              </ul>
              <p>
                We make no guarantee as to the continued availability of
                external links, and users should always verify information
                through official channels.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Website Availability
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>We make no guarantee that this website will be:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Available at all times</li>
                <li>Error-free or uninterrupted</li>
                <li>Free from technical problems</li>
                <li>Compatible with your equipment</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Indemnification
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Users agree to indemnify and hold harmless the website operators
              from any claims, damages, losses, or expenses arising from their
              use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Modifications
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              These terms may be modified at any time without notice. Continued
              use of the website constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Governing Law
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              These terms are governed by the laws of the Republic of the
              Philippines without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Severability
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              If any provision of these terms is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Content Concerns and Takedown Requests
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                While we strive to provide accurate public domain information,
                we recognize that errors, outdated information, or other
                concerns may arise.
              </p>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <h3 className="font-semibold text-neutral-900 text-base mb-3">
                  Reporting Concerning Content:
                </h3>
                <p className="mb-2">
                  If you believe content on this website is:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 mb-4">
                  <li>Factually incorrect or misleading</li>
                  <li>Potentially harmful or dangerous</li>
                  <li>Violates applicable laws</li>
                  <li>
                    Contains personal information that should not be public
                  </li>
                  <li>Infringes on legitimate rights</li>
                </ul>

                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <p className="font-semibold">
                    Please contact us at:{" "}
                    <a
                      href="mailto:volunteers@bettergov.ph"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      volunteers@bettergov.ph
                    </a>
                  </p>
                </div>

                <p className="mb-2">Please include:</p>
                <ul className="list-disc list-outside ml-5 space-y-2">
                  <li>Specific URL or page location</li>
                  <li>Clear description of the concern</li>
                  <li>Supporting documentation or evidence where applicable</li>
                  <li>Your contact information for follow-up</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 text-base mb-3">
                  Our Response Process:
                </h3>
                <ul className="list-disc list-outside ml-5 space-y-2 text-green-800">
                  <li>We will review all legitimate concerns in good faith</li>
                  <li>Response time may vary due to our volunteer nature</li>
                  <li>
                    We may remove, modify, or add disclaimers to content as
                    appropriate
                  </li>
                  <li>
                    We reserve the right to make editorial decisions about
                    content
                  </li>
                  <li>
                    We are not obligated to remove content but will consider all
                    reasonable requests
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>False or Frivolous Complaints:</strong> Submitting
                  knowingly false takedown requests or complaints may result in
                  being blocked from contacting our volunteers.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Contact Information
              </h2>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <p className="text-primary-800 mb-2">
                For questions about these terms or content concerns, contact:
              </p>
              <p className="text-xl font-semibold text-primary-900">
                <a
                  href="mailto:volunteers@bettergov.ph"
                  className="hover:text-primary-700 transition-colors"
                >
                  volunteers@bettergov.ph
                </a>
              </p>
              <p className="text-primary-700 mt-4 italic">
                This website provides public domain information for educational
                and informational purposes only.
              </p>
            </div>
            <div>
              <p className="text-neutral-900 font-semibold mt-4">
                Effective as of November 24, 2025
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
