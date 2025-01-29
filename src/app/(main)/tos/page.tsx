import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TermsAndConditions");
  return {
    title: t("Terms of Service"),
  };
}

export default async function Page() {
  const t = await getTranslations("TermsAndConditions");
  return (
    <main className="mx-auto max-w-prose space-y-6 p-3 py-6">
      <h1 className="text-center text-2xl font-bold">
        {t("Terms of Service")}
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        {t("Effective Date: Jan 21, 2025")}
      </p>
      <p>
        Welcome to AI Resume Builder. These Terms of Service (&quot;Terms&quot;)
        govern your use of our website and services. By accessing or using AI
        Resume Builder (&quot;the Service&quot;), you agree to be bound by these
        Terms. If you do not agree to these Terms, do not use the Service.
      </p>
      <h2 className="text-xl font-semibold">1. Overview</h2>
      <p>
        AI Resume Builder is a SaaS platform that provides resume-building tools
        powered by artificial intelligence. Users can create resumes and
        download them for a fixed price.
      </p>
      <h2 className="text-xl font-semibold">2. Eligibility</h2>
      <p>
        You must be at least 18 years old and capable of entering into legally
        binding contracts to use this Service. By accessing the Service, you
        confirm that you meet this eligibility requirement.
      </p>
      <h2 className="text-xl font-semibold">3. Account Registration</h2>
      <p>
        To access some features of the Service, you must create an account. When
        registering, you agree to provide accurate and current information. You
        are responsible for maintaining the security of your account and
        password. We are not liable for any loss or damage resulting from
        unauthorized access to your account.
      </p>
      <h2 className="text-xl font-semibold">4. Payments</h2>
      <p>
        To download a resume, users must make a one-time payment. All payments
        are processed securely through our third-party payment provider. AI
        Resume Builder does not offer refunds for completed transactions.
      </p>
      <h2 className="text-xl font-semibold">5. License to Use the Service</h2>
      <p>
        AI Resume Builder grants you a limited, non-exclusive, non-transferable,
        and revocable license to use the Service for personal or professional
        use in accordance with these Terms. You may not:
      </p>
      <ul className="list-inside list-disc">
        <li>Copy, modify, or distribute any part of the Service;</li>
        <li>Use the Service to build a competing product;</li>
        <li>
          Access or attempt to access the Service by any means other than
          through the interfaces provided.
        </li>
      </ul>
      <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
      <p>
        All content, trademarks, logos, and intellectual property related to AI
        Resume Builder are owned by AI Resume Builder or its licensors. You
        agree not to infringe on these rights.
      </p>
      <h2 className="text-xl font-semibold">7. Privacy Policy</h2>
      <p>
        Your privacy is important to us. Please review our Privacy Policy [link]
        to understand how we collect, use, and protect your personal
        information.
      </p>
      <h2 className="text-xl font-semibold">8. Third-Party Services</h2>
      <p>
        The Service may contain links or integrations to third-party websites or
        services. AI Resume Builder is not responsible for the content or
        practices of any third-party websites or services.
      </p>
      <h2 className="text-xl font-semibold">9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis. AI Resume Builder makes no warranties, express or
        implied, regarding the Service, including but not limited to the
        accuracy of resume outputs, the suitability of resumes for job
        applications, or the uninterrupted availability of the Service.
      </p>
      <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, AI Resume Builder shall not be
        liable for any indirect, incidental, consequential, or punitive damages,
        including loss of profits, data, or business opportunities, arising out
        of or related to your use of the Service.
      </p>
      <h2 className="text-xl font-semibold">11. Governing Law</h2>
      <h2 className="text-xl font-semibold">12. Changes to the Terms</h2>
      <p>
        We may update these Terms from time to time. Any changes will be posted
        on this page, and the &quot;Effective Date&quot; will be updated
        accordingly. Your continued use of the Service after the changes take
        effect will constitute your acceptance of the new Terms.
      </p>
      <h2 className="text-xl font-semibold">13. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at
        gio.patsia@gmail.com.
      </p>
      <p>
        By using AI Resume Builder, you acknowledge that you have read,
        understood, and agree to these Terms of Service.
      </p>
    </main>
  );
}
